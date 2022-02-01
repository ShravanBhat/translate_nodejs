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

//list of languages similar to each other
const similarLanguages = [
    ["hi", "kn", "ta", "te", "ml"],
    ["mr", "gu", "hi", "sd"],
    ["bn", "pa", "or", "as", "ur", "bh"],
    ["en", "cy"],
    ["fr", "de", "it", "es", "nl"]
]

//funtion for smart caching
module.exports.smartcaching = function(sourceText, targetlanguageCode, sourceLanguageCode) {
    //check if the input target language is in the particular row or not
    for (let i = 0; i < similarLanguages.length; i++) {
        if (similarLanguages[i].includes(targetlanguageCode)) {
            
            for (j = 0; j < similarLanguages[i].length; j++) {      //if a particular row includes the language then run the loop to cache output for all the languages in that row
                console.log(similarLanguages[i][j]);
                let sourceLanguageCode = 'en';
                let key = sourceLanguageCode + ":" + sourceText + ":" + similarLanguages[i][j];
                if (similarLanguages[i][j] != targetlanguageCode) {

                    translateapi(sourceText, {
                        from: sourceLanguageCode,
                        to: similarLanguages[i][j]
                    }).then(response => {

                        //console.log(key);
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