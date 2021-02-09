const {createLogger, transports, format} = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.File({filename: 'error.log', level: 'error'}),
    ],
    exitOnError: false

});


if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}


module.exports = logger