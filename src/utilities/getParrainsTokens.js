const db = require('../../db/models/index');
const User = db.User
const logger = require('../startup/logger')

const getParrainsTokens = async (comptes) => {
    try {
        const tokens = []
        for(let i=0; i<comptes.length; i++) {
            let selectedCompte = comptes[i].dataValues
            const selectedUser =  await User.findByPk(selectedCompte.UserId)
            if(selectedUser?.pushNotificationToken) tokens.push(selectedUser.pushNotificationToken)
        }
        return tokens
    } catch (e) {
        logger.info(e.message)
    }

}

module.exports = {
    getParrainsTokens
}