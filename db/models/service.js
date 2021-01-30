'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service.belongsTo(models.Categorie)
      Service.belongsToMany(models.ShoppingCart, {
        through: {
          model: models.CartItem,
          unique: false,
          scope: {
            itemType: 'service'
          }
        },
        foreignKey: 'itemId',
        constraints: false
      })
    }
  };
  Service.init({
    codeService: DataTypes.STRING,
    libelle: DataTypes.STRING,
    imagesService: DataTypes.ARRAY(DataTypes.STRING),
    description: DataTypes.STRING,
    montantMin: {
      type: DataTypes.INTEGER,
    defaultValue: 0
    },
    montantMax: {
      type: DataTypes.INTEGER,
    defaultValue: 0
    },
    isDispo: {
      type: DataTypes.BOOLEAN,
    defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};