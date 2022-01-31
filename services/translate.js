const translateapi = require('@vitalets/google-translate-api'); //module used for translation

const ISO6391 = require('iso-639-1');
const cacheSetter = require('../middleware/cache');
const preCache = require('../middleware/smartcache');

const redis = require('redis');
const redisconf = require('../config.js');

const REDIS_PORT = redisconf.port; //fetch port
const REDIS_HOST = redisconf.host; //host
const REDIS_PASSWORD = redisconf.password; //and password from config file

const client = redis.createClient({
    url: 'redis://:' + REDIS_PASSWORD + '@' + REDIS_HOST + ':'+REDIS_PORT
});

(async () => {
    await client.connect();
})();
module.exports.translate = function(req, res) {
    try {
        let requestparam = req.query;
        let output = {};
        let targetLanguageCode = ISO6391.getCode(requestparam.targetLanguage)
        let sourceLanguageCode = ISO6391.getCode(requestparam.sourceLanguage) || 'en';
        console.log('Precaching...');
        preCache.smartcaching(requestparam.sourceText, targetLanguageCode, sourceLanguageCode);

        //if the input language name is correct,it will check the avalability of text in check else it outputs invalid language
        if (targetLanguageCode) {
            console.log('Translating...');
            translateapi(requestparam.sourceText, {from: sourceLanguageCode,to: targetLanguageCode}) //Translation api
            .then(response => {
                console.log(response.text);
                let key = sourceLanguageCode + ":" + requestparam.sourceText + ":" + targetLanguageCode;
               
                cacheSetter.cacheSet(key, response.text);

                output.inputLanguage = requestparam.sourceLanguage;
                output.inputText = requestparam.sourceText;

                output.targetLanguage = requestparam.targetLanguage;
                output.translatedText = response.text;

                return res.json(200, {
                    success: true,
                    data: output
                });

            }).catch(err => {
                console.error(err);
            });
        } else {
            return res.json(422, {
                success: false,
                message: "Kindly check the source Language" //incase the input lang is incorrect 
            });
        }
    } catch (err) {
        console.log(err);
    }
};