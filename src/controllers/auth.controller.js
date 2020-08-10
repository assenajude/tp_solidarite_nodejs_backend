const db = require('../models/index');
const jwtSecretConfig = require('../../config/auth.config')
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

signup = async (req, res, next) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        nom: req.body.nom,
        prenom: req.body.prenom,
        phone: req.body.phone,
        adresse: req.body.adresse,
        avatar: req.body.avatar,
        pieceIdentite: req.body.pieceIdentite,
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
            res.status(201).send(`L'utilisateur a été enregistré avec succès`)
        } else {
            user.setRoles([3]);
            res.status(201).send(`L'utilisateur a été enregistré avec succès`)
        }

    } catch (error) {
        return res.status(500).send(error.message)
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
/*        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {username: req.body.username},
                    {email: req.body.email},
                    ]
            }
        });*/
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
         let token = jwt.sign({id: user.id}, jwtSecretConfig.secret, {
             expiresIn: 86400
         });

         let authorities = [];
         const roles = await user.getRoles();
          roles.forEach(role => {
              authorities.push('ROLE_' + role.name.toUpperCase())
          })
        return res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        })
    } catch (e) {
        return res.status(500).send(e.message)
        //next(e.message)
    }
};

module.exports = {
    signup,
    signin
}