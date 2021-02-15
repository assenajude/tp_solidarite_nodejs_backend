const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
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


if (cluster.isMaster) {
    logger.info(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.info(`worker ${worker.process.pid} died`);
    });
} else {

    const server = http.createServer(app);

    server.on('error', errorHandler);
    server.on('listening', () => {
        const address = server.address();
        const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
        logger.info('Listening on ' + bind);
    });

    server.listen(port);

    logger.info(`Worker ${process.pid} started`);
}


