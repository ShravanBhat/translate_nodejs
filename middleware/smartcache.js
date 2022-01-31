const redis = require('redis');
const redisconf = require('../config.js');
const cacheSetter = require('../middleware/cache');

const REDIS_PORT = redisconf.port;
const REDIS_HOST = redisconf.host;
const REDIS_PASSWORD = redisconf.password;
const translateapi = require('@vitalets/google-translate-api');

const client = redis.createClient({
    url: 'redis://:' + REDIS_PASSWORD + '@' + REDIS_HOST + ':' + REDIS_PORT
});

client.on('connect', () => {
    console.log('connected to port')
})
const translate = require('@vitalets/google-translate-api');

const ISO6391 = require('iso-639-1');

const similarLanguagesList = [
    ["hi", "kn", "ta", "te", "ml"],
    ["mr", "gu", "hi", "sd"],
    ["bn", "pa", "or", "as", "ur", "bh"],
    ["en", "cy", ],
    ["fr", "de", "it", "es", "nl"]
]


module.exports.smartcaching = function(sourceText, targetlanguageCode, sourceLanguageCode) {

    for (let i = 0; i < similarLanguagesList.length; i++) {
        if (similarLanguagesList[i].includes(targetlanguageCode)) {

            for (j = 0; j < similarLanguagesList[i].length; j++) {
                console.log(similarLanguagesList[i][j]);

                let sourceLanguageCode = 'en';
                let key = sourceLanguageCode + ":" + sourceText + ":" + similarLanguagesList[i][j];
                if (similarLanguagesList[i][j] != targetlanguageCode) {

                    translateapi(sourceText, {
                        from: sourceLanguageCode,
                        to: similarLanguagesList[i][j]
                    }).then(response => {

                        console.log(key);
                        cacheSetter.cacheSet(key, response.text);
                    }).catch(err => {
                        console.error(err);
                    });
                }
            }
            break;
        }
    }
}