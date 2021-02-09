'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, {
        as: 'receiver'
      })
      Message.belongsTo(models.User, {
        as: 'sender'
      })
      Message.hasMany(models.MsgResponse)
    }
  };
  Message.init({
    msgHeader: DataTypes.STRING,
    content: {
      type: DataTypes.STRING(1000),
    },
    reference: DataTypes.STRING,
    isRead:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};