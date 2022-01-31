const translateapi = require('@vitalets/google-translate-api');

const ISO6391 = require('iso-639-1');
const cacheSetter = require('../middleware/cache');
const preCache = require('../middleware/smartcache');

const redis = require('redis');
const redisconf = require('../config.js');

const REDIS_PORT = redisconf.port;
const REDIS_HOST = redisconf.host;
const REDIS_PASSWORD = redisconf.password;

const client = redis.createClient({
    url: 'redis://:' + REDIS_PASSWORD + '@' + REDIS_HOST + ':10901'
});

(async () => {
    await client.connect();
})();
module.exports.translate = function (req, res) {
    try {

        let languageCode = ISO6391.getCode(req.body.targetLanguage)
        console.log('Precaching...');
        preCache.smartcaching(req.body.sourceText, languageCode);

        console.log('Translating...');
        translateapi(req.body.sourceText, { to: languageCode }).then(response => {
            console.log(response.text);
            let key = req.body.sourceText + ":" + languageCode;
            //client.set(key, response.text);
            cacheSetter.cacheSet(key, response.text);


            return res.json(200, {
                message: "Here is the translated text",
                data: response.text
            });
            //=> nl
        }).catch(err => {
            console.error(err);
        });


    } catch (err) {
        console.log(err);
    }


};