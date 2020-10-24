const {createLogger, transports, format} = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.File({filename: 'error.log', level: 'error'}),
        //new winston.transports.File({filename: 'combined.log'}),
    ],
 /*   exceptionHandlers: [
      new transports.File({filename: 'exceptions.log'})
    ],
    rejectionHandlers: [
        new transports.File({filename: 'exceptions.log'})
    ],*/

    exitOnError: false

});


if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}


module.exports = logger