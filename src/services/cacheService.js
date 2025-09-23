// src/services/cache.service.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

async function set(key, val, exSeconds) {
  await redis.set(key, val, 'EX', exSeconds);
}
async function get(key) { return await redis.get(key); }
async function del(key) { return await redis.del(key); }
async function incr(key) { return await redis.incr(key); }
async function expire(key, seconds) { return await redis.expire(key, seconds); }
module.exports = { set, get, del, incr, expire };