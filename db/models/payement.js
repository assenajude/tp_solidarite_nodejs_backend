'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payement.hasMany(models.Plan)
    }
  };
  Payement.init({
    mode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payement',
  });
  return Payement;
};