const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.config');
const db = require('../models/index');
const User = db.user;

verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send('Pas de jeton de securite dans la requete');
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send(`Vous n'êtes pas autorisé`);
        req.userId = decoded.id;
        next();
    });

};

isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for(let i = 0; i< roles.length; i++) {
            if (roles[i].name === 'admin') {
                next();
                return ;
            }
        }
        return res.status(403).send('Role administrateur requis');
    } catch (e) {
        next(e.message)
    }

};

isModerator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        roles.forEach(role => {
            if (role.name === 'moderator') {
                next();
                return;
            }})
        return res.status(403).send(`Role moderateur requis`);
    } catch (e) {
        next(e.message)
    }
};

isAdminOrModerator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        roles.forEach(role => {
            if (role.name === 'admin') {
                next();
                return;
            }
            if (role.name === 'moderator') {
                next();
                return;
            }
        })
        return res.status(403).send(`role administrateur ou moderateur requis`)

    } catch (e) {
        next(e.message)
    }
};


module.exports = {
    verifyToken,
    isAdmin,
    isModerator,
    isAdminOrModerator
}
