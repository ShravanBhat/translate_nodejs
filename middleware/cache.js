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


module.exports.cacheFetch = function (req, res, next) {

  if (req.body.sourceText.length == 0) {
    return res.json(422, {
      message: "Please enter text",

    });
  }
  let languageCode = ISO6391.getCode(req.body.targetLanguage);

  let key = req.body.sourceText + ":" + languageCode;
  (async () => {

    const value = await client.get(key);
    if (value) {
      return res.json(200, {
        message: "Here is the translated text",
        data: value
      });
    
    } else {
      next();
    }
    console.log(value);


  })();
}

module.exports.cacheSet = function (key, res) {
  client.setEx(key, 2000, res);
  console.log("Cache Set Successfully");

}