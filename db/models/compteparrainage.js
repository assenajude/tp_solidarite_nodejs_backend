'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompteParrainage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CompteParrainage.belongsTo(models.User)
      CompteParrainage.belongsToMany(models.Commande, {
        through: models.OrderParrain
      })
    }
  };
  CompteParrainage.init({
    initial: DataTypes.INTEGER,
    gain: DataTypes.INTEGER,
    depense: DataTypes.INTEGER,
    quotite: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    compteState: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
  }, {
    sequelize,
    modelName: 'CompteParrainage',
  });
  return CompteParrainage;
};