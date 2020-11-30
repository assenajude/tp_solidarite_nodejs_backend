
const db = require('../../db/models/index');
const decoder = require('jwt-decode')
const sendMail = require('../utilities/sendEmail')
const Commande = db.Commande;
const UserAdresse = db.UserAdresse;
const Plan = db.Plan;
const User = db.User
const CartItem = db.CartItem
const Facture = db.Facture
const Contrat = db.Contrat
const ShoppingCart = db.ShoppingCart
const Article = db.Article
const Location = db.Location
const Service = db.Service
const Op = db.Sequelize.Op


const saveOrder = async (req, res, next) => {
    const token = req.headers['x-access-token']
      const connectedUser = decoder(token)
    try{
        let items = []
        let user = await User.findByPk(connectedUser.id)
        if(!user) return res.status(404).send("l'utlisateur n'a pas été trouvé")
        const userAdresse = await UserAdresse.findByPk(req.body.userAdresseId, )
        const plan = await Plan.findByPk(req.body.planId)
        const allSaved = await Commande.findAll();
        const orderCounter = allSaved.length++

       let order = await user.createCommande({
           numero: `TPSODR0000${orderCounter+1}`,
           itemsLength: req.body.itemsLength,
           interet: req.body.interet,
           fraisTransport: req.body.fraisTransport,
           montant: req.body.montant,
           dateLivraisonDepart: req.body.dateLivraisonDepart,
           typeCmde: req.body.typeCmde
       })
        if(userAdresse) {
            await order.setUserAdresse(userAdresse)
        }
        if(plan) {
            await order.setPlan(plan)
        }

        const userShoppingCart = await ShoppingCart.findOne({
            where: {UserId: user.id}
        })

       items = req.body.items

       for(let i = 0; i <items.length; i++) {
           (function (i) {
               let newItem = items[i];
               (async function(item) {
                   await order.createCartItem(item.id, {
                       through: {
                           libelle: item.libelle,
                           image: item.image,
                           prix: item.prix,
                           quantite: item.quantite,
                           montant: item.montant
                       }
                   })
               })(newItem)
           })(i)
       }

        if(order.typeCmde === 'e-commerce') {
            for(let i = 0; i < items.length; i++) {
                (function (i) {
                let newItem = items[i];
                    (async function (item) {
                        let selectedItem = await Article.findByPk(item.id)
                          selectedItem.qteStock -= item.quantite
                        await selectedItem.save()
                    })(newItem)
                })(i)
            }
            await userShoppingCart.setArticles([])
        } else if(order.typeCmde === 'e-location') {
            let selectedLocation = await Location.findByPk(items[0].id)
            selectedLocation.qteDispo -= items[0].quantite
            await selectedLocation.save()
            await userShoppingCart.setLocations([])
        } else {
            await userShoppingCart.setServices([])
        }

        userShoppingCart.cartLength = 0
        userShoppingCart.cartAmount = 0
        await userShoppingCart.save()

      const newAdded =  await Commande.findByPk(order.id, {
           include: [UserAdresse, Plan, CartItem, Facture, Contrat],
           })
        //sendMail.orderSuccessMail(user,req.body.items, req.body.fraisTransport, req.body.interet, req.body.montant)
       return  res.status(200).send(newAdded)
    } catch (e) {
        next(e.message)

    }
}

deleteOrder = async (req, res, next) => {
    const orderId = req.body.orderId
    try {
        const order = await Commande.findByPk(orderId)
        if(!order) return res.sendStatus(404).send(`La commande d'id ${orderId} que vous voulez supprimer n'existe pas`)
        await order.destroy()
        return res.sendStatus(200)

    } catch (e) {
        next(e.message)
    }
}

updateOrder = async (req, res, next) => {
    try{
        let order = await Commande.findByPk(req.body.orderId)
        if(!order) return res.status(404).send(`La commande que voulez modifier n'exite pas`)


        if (req.body.statusAccord) {
        order.statusAccord = req.body.statusAccord
        }
        if (req.body.statusLivraison) {
        order.statusLivraison = req.body.statusLivraison
        order.dateLivraisonFinal = Date.now()
        }
        if(req.body.history) {
            order.historique = req.body.history
        }
        await order.save()
        const updatedOrder = await order.reload({
            include: [UserAdresse, Plan, CartItem, Facture, Contrat]
        })
        return res.status(200).send(updatedOrder)
    } catch (e) {
        next(e.message)
    }
}

getOrdersByUser = async (req,res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    const transaction = await db.sequelize.transaction()
    try{
        const userOrders = await Commande.findAll({
            where: {UserId: user.id},
            include: [{all: true}],
            transaction
        })
        await transaction.commit()
        return res.status(200).send(userOrders)
    } catch (e) {
        await transaction.rollback()
        next(e.message)
    }
}

getAllOrder = async (req, res, next) => {
   // const transaction = await db.sequelize.transaction()
    try {
    const orders = await Commande.findAll({
        where: {userId: 1 },
        include: [
                 UserAdresse,Plan, CartItem, Facture, Contrat
        ],
    })
        // await transaction.commit()
        res.status(200).send(orders)
    } catch (e) {
        // await transaction.rollback()
        next(e.message)
    }
}

createOrderContrat = async (req, res, next) => {
    const orderId = req.body.orderId
    const contratData = {
        dateDebut: req.body.debut,
        dateFin: req.body.fin,
        dateCloture: req.body.cloture,
        montant: req.body.montant,
        mensualite: req.body.nbMensualite,
        status: req.body.status
    }

    try{
        let order = await Commande.findByPk(orderId)
        if(!order) return res.status(404).send("La commande n'existe pas")
        await order.createContrat(contratData)
        const justUpdated = await order.reload({
            include: [UserAdresse,Plan, CartItem, Facture, Contrat]
        })
        return res.status(200).send(justUpdated)
    } catch (e) {
        next(e.message)
    }
}

updateOrderContrat = async (req, res, next) => {
    const commandeId = req.body.commandeId
    try {
        let selectedContrat = await Contrat.findOne({
            where: {
                CommandeId: commandeId
            }
        })
        if(!selectedContrat) return res.status(404).send('commande introuvable')
        selectedContrat.status = req.body.contratStatus
        selectedContrat.dateCloture = req.body.dateCloture
        await selectedContrat.save()
        const updatedOrder = await Commande.findByPk(commandeId, {
            include: [UserAdresse,  Plan, CartItem, Contrat, Facture]
        })

        return res.status(200).send(updatedOrder)

    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    getOrdersByUser,
    saveOrder,
    getAllOrder,
    updateOrder,
    deleteOrder,
    createOrderContrat,
    updateOrderContrat
}