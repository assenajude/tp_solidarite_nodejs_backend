'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proposition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Proposition.belongsToMany(models.User, {
        through: 'Users_Propositions',
        foreignKey: 'propositionId',
        otherKey: 'userId'
      })
    }
  };
  Proposition.init({
    designation: DataTypes.STRING,
    description: DataTypes.ARRAY(DataTypes.JSON),
    referenceId: DataTypes.INTEGER,
    typeReference: DataTypes.STRING,
    isOk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dateAchat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    imagesProposition: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Proposition',
  });
  return Proposition;
};