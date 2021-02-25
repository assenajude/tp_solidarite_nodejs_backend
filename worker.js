let throng = require('throng')
let Queue = require('bull')
const Payement = db.Payement;

let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
let workers = process.env.WEB_CONCURRENCY || 2

let maxJobPerWorker = 20

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {
    let workeQueue = new Queue('work', REDIS_URL)
    workeQueue.process(maxJobPerWorker, async (job) => {
        let newPlan = await Payement.createPlan(job.data)
        let progress = 0
        if(Math.random() < 0.05) {
            throw new Error('this job failed')
        }
        while (job < 100 ) {
            await sleep(50)
            process += 1
            job.progress(progress)
        }
        return newPlan
    })
}

throng({workers, start});