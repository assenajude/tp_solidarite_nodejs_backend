'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParrainFilleul extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ParrainFilleul.init({
    messageSent: DataTypes.BOOLEAN,
    inSponsoring: DataTypes.BOOLEAN,
    sponsoringState: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'ParrainFilleul',
  });
  return ParrainFilleul;
};