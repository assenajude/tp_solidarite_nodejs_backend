'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Response extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Response.belongsTo(models.Question)
    }
  };
  Response.init({
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Response',
  });
  return Response;
};