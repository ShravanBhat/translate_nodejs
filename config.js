redis = {
  host: process.env.REDIS_HOST || 'redis-10901.c92.us-east-1-3.ec2.cloud.redislabs.com',
  port: process.env.REDIS_PORT || 10901,
  password: process.env.REDIS_PASSWORD || 'iPeSzISqXJsgXob06dITZfWuOHZcSuy0'
}
module.exports = redis;