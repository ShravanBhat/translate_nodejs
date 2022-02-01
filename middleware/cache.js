const redis = require('redis');
const redisconf = require('../config.js');
const ISO6391 = require('iso-639-1'); //using ISO639-1 to get language code from language name

const REDIS_PORT = redisconf.port; //fetch port
const REDIS_HOST = redisconf.host; //host
const REDIS_PASSWORD = redisconf.password; //and password from config file

const client = redis.createClient({
    url: 'redis://:' + REDIS_PASSWORD + '@' + REDIS_HOST + ':'+REDIS_PORT
});

(async () => {
    await client.connect();
})();

//function to fetch data from cache
module.exports.cacheFetch = function(req, res, next) {
    let requestparam = req.query; //get parameters from request
    if (req.query.sourceText.length == 0) {
        return res.json(422, {
            success: false,
            message: "Please enter the text"

        });
    }
    let output = {};
    let targetLanguageCode = ISO6391.getCode(requestparam.targetLanguage);
    let sourceLanguageCode = ISO6391.getCode(requestparam.sourceLanguage) || 'en';

    //if the input language name is correct,it will check the avalability of text in check else it outputs invalid language
    if (targetLanguageCode) { 
        let key = sourceLanguageCode + ":" + requestparam.sourceText + ":" + targetLanguageCode;
        (async () => {
            try {
                const value = await client.get(key);
                if (value) {

                    output.inputLanguage = requestparam.sourceLanguage || 'English';
                    output.inputText = requestparam.sourceText;

                    output.targetLanguage = requestparam.targetLanguage;
                    output.translatedText = value;


                    return res.json(200, {
                        success: true,
                        data: output
                    });

                } else {
                    next();
                }
                console.log(value);
            } catch (err) {
                throw err;
            }

        })();
    } else {
        return res.json(422, {
            success: false,
            message: "Kindly check the source Language"
        });
    }
}

//set the cache with expiration of 2000 secs
//to set the cache without expiration,we can use client.set(key,res);
module.exports.cacheSet = function(key, res) {
    client.setEx(key, 2000, res);
    //console.log("Cache Set Successfully");

}