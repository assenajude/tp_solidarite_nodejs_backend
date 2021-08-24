'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductOption.belongsToMany(models.Article, {
        through: models.ArticleOption,
        foreignKey: 'optionId',
        otherKey: 'articleId'
      })
      ProductOption.belongsToMany(models.Location, {
        through: models.LocationOption,
        foreignKey: 'optionId',
        otherKey: 'locationId'
      })
      // define association here
    }
  };
  ProductOption.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    couleur: DataTypes.STRING,
    taille: DataTypes.STRING,
    modele: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ProductOption',
  });
  return ProductOption;
};