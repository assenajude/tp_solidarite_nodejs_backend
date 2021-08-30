const logger = require('../startup/logger')
module.exports = async (error, req, res, next) => {
    const statusCode = error.statusCode?error.statusCode : 500
    const message = error.message?error.message : error
    logger.info(message)
    return res.status(statusCode).send(message);
}