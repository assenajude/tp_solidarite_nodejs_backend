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
    pieceIdentite: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};