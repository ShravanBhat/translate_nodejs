const redis = require('redis');
const redisconf = require('../config.js');
const ISO6391 = require('iso-639-1');

const REDIS_PORT = redisconf.port;
const REDIS_HOST = redisconf.host;
const REDIS_PASSWORD = redisconf.password;

const client = redis.createClient({
    url: 'redis://:' + REDIS_PASSWORD + '@' + REDIS_HOST + ':10901'
});

(async () => {
    await client.connect();
})();


module.exports.cacheFetch = function(req, res, next) {
    let requestparam = req.query;
    if (req.query.sourceText.length == 0) {
        return res.json(422, {
            message: "Please enter text",

        });
    }
    let output = {};
    let targetLanguageCode = ISO6391.getCode(requestparam.targetLanguage);
    let sourceLanguageCode = ISO6391.getCode(requestparam.sourceLanguage) || 'en';
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

module.exports.cacheSet = function(key, res) {
    client.setEx(key, 2000, res);
    console.log("Cache Set Successfully");

}