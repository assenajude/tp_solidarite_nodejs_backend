const http = require('http');
let Queue = require('bull')
const app = require('./app');
const logger = require('./src/startup/logger')

const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '5000');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let workQueue = new Queue('work', REDIS_URL)

app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            logger.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};


app.post('/job', async (req, res) => {
    let job = await workQueue.add()
    res.json({id: job.id})
})
app.get('/job/:id', async (req, res) => {
    let id = req.params.id
    let job = await workQueue.getJobFromId(id)
    if(job === null) {
        res.status(404).end();
    } else {
        let state = await job.getState()
        let progress = job._progress
        let reason = job.failedReason
        res.json({id, state, progress, reason});

    }
})


    const server = http.createServer(app);

    server.on('error', errorHandler);
    server.on('listening', () => {
        const address = server.address();
        const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
        logger.info('Listening on ' + bind);
    });

    server.listen(port);

workQueue.on('global:completed', (jobId, result) => {
    logger.info(`job completed with result ${result}`)
})



