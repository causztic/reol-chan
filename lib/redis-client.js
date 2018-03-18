const redis = require('redis');
const redisClient = redis.createClient(process.env.REDISTOGO_URL);
module.exports = redisClient;