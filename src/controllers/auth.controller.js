require('dotenv').config()
const generateRandom = require('../utilities/generateRandom')
const sendMail = require('../utilities/sendEmail')
const db = require('../../db/models');
const Op = db.Sequelize.Op;
const User = db.User;
const Role = db.Role;


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let authToken = null;


signup = async (req, res, next) => {
    const newUser = {
        username: req.body.username,
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
        next(error.message)
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
             roles: authorities,
         }, process.env.JWT_KEY, {
             expiresIn: 86400
         });

        return res.status(200).send({
            accessToken: authToken
        })
    } catch (e) {
        return res.status(500).send(e.message)
    }
};

const sendResetInfoMail = async (req, res, next) => {
    try {
        let selectedUser = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        if(!selectedUser) return res.status(404).send('Le mail fourni ne correspond à aucun utilisateur')
        const max = 100000
        const min = 999999
        const generatedCode = generateRandom(min, max)
        const formatedCode = String(generatedCode)
        const newResetToken = bcrypt.hashSync(formatedCode, 8)
        selectedUser.resetToken = newResetToken
        await selectedUser.save()
        sendMail.resetUserInfo(generatedCode, req.body.email)
        return res.status(200).send('le code de reinitialisation a été envoyé')
    } catch (e) {
        next(e.message)
    }
}

const modifyUserInfos = async (req, res, next) => {
    console.log('modifying user data......................')
    try {
    let selectedUser = await User.findOne({
        where: {
            email: req.body.email
        }
    })
        if(!selectedUser) return res.status(404).send("L'utilisateur n'a pas été trouvé")

        const codeValid = bcrypt.compareSync(
            req.body.code, selectedUser.resetToken
        );
        if(!codeValid) return res.status(403).send('les codes ne correspondent pas')
        if(req.body.username && req.body.username.length>0) selectedUser.username = req.body.username
        if(req.body.password && req.body.password.length>0) selectedUser.password = bcrypt.hashSync(req.body.password, 10)
        await selectedUser.save()
        return res.status(200).send('Infos mis à jour avec succès ')
    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    signup,
    signin,
    sendResetInfoMail,
    modifyUserInfos
}