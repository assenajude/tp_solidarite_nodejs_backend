const config = require('config');
const Sequelize = require('sequelize');
//const dbConfig = config.get('dbConfig');

let sequelize = new Sequelize(
    config.get('dbConfig.DB'),
    config.get('dbConfig.USER'),
    config.get('dbConfig.PASSWORD'),

    {
        host: config.get('dbConfig.HOST'),
        dialect: config.get('dbConfig.dialect'),

        pool: {
            max: config.get('dbConfig.pool.max'),
            min: config.get('dbConfig.pool.min'),
            acquire: config.get('dbConfig.pool.acquire'),
            idle: config.get('dbConfig.pool.idle')
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.categorie = require('./categorie.model')(sequelize, Sequelize);
db.article = require('./article.model')(sequelize, Sequelize);
db.location = require('./location.model')(sequelize, Sequelize);
db.commande = require('./commande.model')(sequelize, Sequelize);
db.payement = require('./payement.model')(sequelize, Sequelize);
db.plan = require('./plan.model')(sequelize, Sequelize);
db.userAdresse = require('./userAdresse.model')(sequelize, Sequelize);
db.shoppingCart = require('./shoppingCart.model')(sequelize, Sequelize);
db.cartItem = require('./cartItem.model')(sequelize, Sequelize);
db.userPayement = require('./userPayement.model')(sequelize, Sequelize);
db.userFacture = require('./userFacture.model')(sequelize, Sequelize);
db.pointRelais = require('./pointRelais.model')(sequelize, Sequelize);
db.region = require('./region.model')(sequelize, Sequelize);
db.ville = require('./ville.model')(sequelize, Sequelize);
db.orderItem = require('./orderItem.model')(sequelize, Sequelize);
db.cartItem = require('./cartItem.model')(sequelize,Sequelize);


db.user.belongsToMany(db.role, {
    through: 'user_roles',
    foreignKey: 'userId',
    otherKey: 'roleId'
});
db.role.belongsToMany(db.user, {
    through: 'user_roles',
    foreignKey: 'roleId',
    otherKey: 'userId'

});

db.categorie.hasMany(db.article);
db.article.belongsTo(db.categorie);

db.categorie.hasMany(db.location);
db.location.belongsTo(db.categorie);


db.user.hasMany(db.userAdresse);
db.userAdresse.belongsTo(db.user);

db.plan.belongsTo(db.payement);
db.payement.hasMany(db.plan);

db.article.belongsToMany(db.shoppingCart, {
    through: db.cartItem,
    foreignKey: 'articleId',
    otherKey: 'shoppingCartId'
});
db.shoppingCart.belongsToMany(db.article, {
    through: db.cartItem,
    foreignKey: 'shoppingCartId',
    otherKey: 'articleId'
});



db.user.belongsToMany(db.payement, {
    through: db.userPayement,
    foreignKey: 'userId',
    otherKey: 'payementId'
});
db.payement.belongsToMany(db.user, {
    through: db.userPayement,
    foreignKey: 'payementId',
    otherKey: 'userId'
});

db.userPayement.belongsTo(db.userFacture);
db.userFacture.hasMany(db.userPayement)

db.region.hasMany(db.ville);
db.ville.belongsTo(db.region);

db.pointRelais.belongsTo(db.ville);
db.ville.hasMany(db.pointRelais)

db.userAdresse.belongsTo(db.pointRelais);
db.pointRelais.hasMany(db.userAdresse);

db.userAdresse.belongsTo(db.user);
db.user.hasMany(db.userAdresse);

db.commande.belongsTo(db.user);
db.user.hasMany(db.commande);

db.commande.belongsTo(db.userAdresse);
db.userAdresse.hasMany(db.commande);

db.commande.belongsTo(db.plan);
db.plan.hasMany(db.commande);

db.article.belongsToMany(db.shoppingCart,{
    through: db.cartItem,
    foreignKey: 'articleId',
    otherKey: 'shoppingCartId'
});
db.shoppingCart.belongsToMany(db.article, {
    through: db.cartItem,
    foreignKey: 'shoppingCartId',
    otherKey: 'articleId'
})



db.shoppingCart.hasMany(db.commande);
db.commande.belongsTo(db.shoppingCart)

db.shoppingCart.belongsTo(db.user)
db.user.hasOne(db.shoppingCart)


db.commande.belongsToMany(db.cartItem, {
    through: db.orderItem,
    foreignKey: 'commandeId',
    otherKey: 'cartItemId'
})
db.cartItem.belongsToMany(db.commande, {
    through: db.orderItem,
    foreignKey: 'cartItemId',
    otherKey: 'commandeId'
})

db.ROLES = ['admin', 'user', 'moderator'];

module.exports = db