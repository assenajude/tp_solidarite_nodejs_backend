require('dotenv').config()
const db = require('../../db/models');
const Op = db.Sequelize.Op;
const User = db.User;
const Role = db.Role;
const {sendPushNotification} = require('../utilities/pushNotification')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let authToken = null;


signup = async (req, res, next) => {
    const newUser = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    };
    try {
        let user = await User.create(newUser);
        if (req.body.roles) {
            const userRoles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            })
           await user.setRoles(userRoles);
        } else {
           await user.setRoles([3]);
        };
        res.status(201).send(` L'utilisateur a été créé avec succès`)
    } catch (error) {
        next(error)
    }
};

signin = async (req, res, next) => {
    let user = {};
    try {
        if (req.body.username) {
            user = await User.findOne({
                where: {username: req.body.username}
            })
        } else {
            user = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
        }

        if (!user) return res.status(404).send(`L'utilisateur n'a pas été trouvé`);
         const passwordValid = bcrypt.compareSync(
             req.body.password, user.password
         );
         if (!passwordValid) {
             return res.status(401).send({
                 accessToken: null,
                 message: 'password invalide'
             })
         };
        let authorities = [];
        const roles = await user.getRoles();
        roles.forEach(role => {
            authorities.push('ROLE_' + role.name.toUpperCase())
        })
         authToken = jwt.sign({
             id: user.id,
             username: user.username,
             email:user.email,
             avatar: user.avatar,
             roles: authorities,
         }, process.env.JWT_KEY, {
             expiresIn: 86400
         });
        if(!user.pushNotificationToken || user.isFirstConnect || user.pushNotificationToken !== req.body.pushNotificationToken) {
            user.pushNotificationToken = req.body.pushNotificationToken
            user.isFirstConnect = false
            await user.save()
            if(req.body.pushNotificationToken) {
                const userData = user.username?user.username : user.email?user.email : ''
                sendPushNotification(`Bienvenue ${userData}, nous sommes heureux de vous recevoir`, [req.body.pushNotificationToken], 'Bienvenue', {notifType: 'welcome'})
            }
        }
        return res.status(200).send({
            accessToken: authToken
        })
    } catch (e) {
     next(e)
    }
};

const autoLoginUser = async (req, res, next) => {
    try {
        const selectedUser = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        if(!selectedUser)return res.status(404).send({message: "Utilisateur non trouvé"})
        let authorities = [];
        const roles = await selectedUser.getRoles();
        roles.forEach(role => {
            authorities.push('ROLE_' + role.name.toUpperCase())
        })
        authToken = jwt.sign({
            id: selectedUser.id,
            username: selectedUser.username,
            email:selectedUser.email,
            avatar: selectedUser.avatar,
            roles: authorities,
        }, process.env.JWT_KEY, {
            expiresIn: 86400
        });
        return res.status(200).send({
            accessToken: authToken
        })
    }catch (e) {
        next(e)
    }

}


module.exports = {
    signup,
    signin,
    autoLoginUser
}