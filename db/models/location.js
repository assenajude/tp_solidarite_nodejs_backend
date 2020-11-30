'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Location.belongsTo(models.Categorie)
      Location.belongsToMany(models.ShoppingCart, {
        through: models.CartItem,
        foreignKey: 'locationId',
        otherKey: 'shoppingCartId'
      })
      Location.belongsToMany(models.User, {
        through: 'locations_favoris',
        foreignKey: 'locationId',
        otherKey: 'userId'
      })
      Location.belongsToMany(models.ProductOption, {
        through: models.LocationOption,
        foreignKey: 'locationId',
        otherKey: 'optionId'
      })
    }
  };
  Location.init({
    codeLocation: DataTypes.STRING,
    libelleLocation: DataTypes.STRING,
    descripLocation: DataTypes.STRING,
    adresseLocation: DataTypes.STRING,
    coutReel: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    coutPromo: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    frequenceLocation: DataTypes.STRING,
    imagesLocation: DataTypes.ARRAY(DataTypes.STRING),
    debutLocation: DataTypes.DATE,
    finLocation: DataTypes.DATE,
    nombreCaution: DataTypes.INTEGER,
    nombrePretendant: DataTypes.INTEGER,
    aide: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    qteDispo: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};