'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Article.belongsTo(models.Categorie)
      Article.belongsToMany(models.ShoppingCart, {
        through: {
          model: models.CartItem,
          unique: false,
          scope: {
            itemType: 'article'
          }
        },
        foreignKey: 'itemId',
        constraints: false
      })
      Article.belongsToMany(models.User, {
        through: 'articles_favoris',
        foreignKey: 'articleId',
        otherKey: 'userId'
      })
      Article.belongsToMany(models.ProductOption, {
        through: models.ArticleOption,
        foreignKey: 'articleId',
        otherKey: 'optionId'
      })
    }
  };
  Article.init({
    codeArticle: DataTypes.STRING,
    designArticle: DataTypes.STRING,
    descripArticle: DataTypes.STRING,
    qteStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    prixReel: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    prixPromo: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    imagesArticle: DataTypes.ARRAY(DataTypes.STRING),
    aide: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};