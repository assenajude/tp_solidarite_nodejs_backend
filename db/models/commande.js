'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commande extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Commande.belongsTo(models.User)
      Commande.belongsTo(models.UserAdresse)
      Commande.belongsTo(models.Plan)
      Commande.belongsToMany(models.CartItem, {
        through: models.OrderItem,
        foreignKey: 'commandeId',
        otherKey: 'cartItemId'
      })
      Commande.hasOne(models.Facture)
      Commande.hasMany(models.Contrat)
      Commande.hasMany(models.Livraison)
      Commande.belongsToMany(models.CompteParrainage,
          {
            through: models.OrderParrain
          })

    }
  };
  Commande.init({
    numero: DataTypes.STRING,
    dateCmde: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    dateLivraisonDepart: DataTypes.DATE,
    statusLivraison: {
      type: DataTypes.STRING,
      defaultValue: "En cours"
    },
    statusAccord: {
      type: DataTypes.STRING,
      defaultValue: "traitement en cours"
    },
    dateLivraisonFinal: DataTypes.DATE,
    itemsLength: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    interet: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    fraisTransport: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    montant:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    typeCmde: DataTypes.STRING,
    expireIn: {
      type: DataTypes.STRING,
      defaultValue: '3j 00h 00m 00s'
    },
    historique: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Commande',
  });
  return Commande;
};