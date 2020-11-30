'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAdresse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserAdresse.belongsTo(models.User)
      UserAdresse.belongsTo(models.PointRelais)
      UserAdresse.hasMany(models.Commande)
    }
  };
  UserAdresse.init({
    nom: DataTypes.STRING,
    tel: DataTypes.STRING,
    email: DataTypes.STRING,
    adresse: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserAdresse',
  });
  return UserAdresse;
};