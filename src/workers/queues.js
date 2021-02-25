const Queue = require('bull')
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const queueOptions = {
    limiter: {
        max: 1,
        duration: 2000,
    },
};


const planQueue = new Queue('planQueue', REDIS_URL,queueOptions)

module.exports = {
    planQueue
}
