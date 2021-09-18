'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association heree
      User.belongsToMany(models.Role, {
        through: 'user_roles',
        foreignKey: 'userId',
        otherKey: 'roleId'
      })
      User.belongsToMany(models.Article, {
        through: 'articles_favoris',
        foreignKey: 'userId',
        otherKey: 'articleId'
      })
      User.belongsToMany(models.Location, {
        through: 'locations_favoris',
        foreignKey: 'userId',
        otherKey: 'locationId'
      })
      User.hasMany(models.UserAdresse)
      User.hasMany(models.Commande)
      User.hasOne(models.ShoppingCart)
      User.belongsToMany(models.Proposition, {
        through: 'Users_Propositions',
        foreignKey: 'userId',
        otherKey: 'propositionId'
      })
      User.hasMany(models.Question)
      User.hasOne(models.CompteParrainage)
      User.belongsToMany(models.User, {
        as: 'Parrains',
        through: models.ParrainFilleul,
        foreignKey: 'filleulId'
      })
      User.belongsToMany(models.User, {
        as: 'Filleuls',
        through: models.ParrainFilleul,
        foreignKey:'parrainId'
      })
    }
  };
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    phone: DataTypes.STRING,
    adresse: DataTypes.STRING,
    avatar: DataTypes.STRING,
    pieceIdentite: DataTypes.ARRAY(DataTypes.STRING),
    profession: DataTypes.STRING,
    domaine: DataTypes.STRING,
    statusEmploi: DataTypes.STRING,
    cashback : {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isHero: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fidelitySeuil: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    articleCompter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    locationCompter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    serviceCompter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    propositionCompter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    parrainageCompter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    helpCompter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    factureCompter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    favoriteCompter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    resetToken: {
      type: DataTypes.STRING
    },
    pushNotificationToken: {
      type: DataTypes.STRING
    },
    isFirstConnect: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};