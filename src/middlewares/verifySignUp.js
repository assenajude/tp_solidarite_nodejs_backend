const db = require('../../db/models');
const ROLES = db.ROLES;
const User = db.User

checkDuplicateEmailOrUsername = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if (user) return res.status(400).send(`le pseudo ${req.body.username} est deja utilisé`);

        const user2 = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user2) return  res.status(400).send(`l'adresse ${req.body.email} est deja utilisé`)
        next();
    } catch (e) {
        next(e.message)
    }

};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
            for (let i = 0; i < req.body.roles.length; i++) {
                if (!ROLES.includes(req.body.roles[i])){
                    res.status(400).send(`Echec! le role ${req.body.roles[i]} n'existe pas`);
                    return;
                }

            }
        }
        next();
};

/*checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + req.body.roles[i]
                });
                return;
            }
        }
    }

    next();
};*/

module.exports = {
    checkDuplicateEmailOrUsername,
    checkRolesExisted
}