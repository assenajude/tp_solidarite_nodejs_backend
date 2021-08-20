const logger = require('../startup/logger')
module.exports = async (error, req, res, next) => {
    if (!error.statusCode) return  error.statusCode = 500;
    logger.error(error.message);
    return res.status(error.statusCode).send({'error': error.message?error.message : error});

}