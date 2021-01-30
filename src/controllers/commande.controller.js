
const db = require('../../db/models/index');
const decoder = require('jwt-decode')
const sendMail = require('../utilities/sendEmail')
const Commande = db.Commande;
const UserAdresse = db.UserAdresse;
const Plan = db.Plan;
const Payement = db.Payement
const User = db.User
const CartItem = db.CartItem
const Facture = db.Facture
const Contrat = db.Contrat
const ShoppingCart = db.ShoppingCart
const Article = db.Article
const Location = db.Location


const saveOrder = async (req, res, next) => {
    try{
    const token = req.headers['x-access-token']
        if(token=== 'null' || !token) return res.status(404).send('Impossible de passer la commande')
      const connectedUser = decoder(token)
        let items = []
        let statusAccord = '';
        let user = await User.findByPk(connectedUser.id)
        if(!user) return res.status(404).send("l'utlisateur n'a pas été trouvé")
        const userAdresse = await UserAdresse.findByPk(req.body.userAdresseId, )
        const plan = await Plan.findByPk(req.body.planId, {include: Payement})
        const modePayement = plan.Payement.mode
        if(modePayement.toLowerCase() === 'cash') {
            statusAccord = 'Accepté'
        } else {
            statusAccord = 'traitement en cours'
        }
        const allSaved = await Commande.findAll();
        const orderCounter = allSaved.length++

       let order = await user.createCommande({
           numero: `TPSODR0000${orderCounter+1}`,
           itemsLength: req.body.itemsLength,
           interet: req.body.interet,
           fraisTransport: req.body.fraisTransport,
           montant: req.body.montant,
           dateLivraisonDepart: req.body.dateLivraisonDepart,
           typeCmde: req.body.typeCmde,
           statusAccord
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
                           montant: item.montant,

                       }
                   })
               })(newItem)
           })(i)
       }

        if(order.typeCmde === 'article') {
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
        } else if(order.typeCmde === 'location') {
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
    const item = req.body
    try {
        const order = await Commande.findByPk(item.id)
        if(!order) return res.sendStatus(404).send(`La commande d'id ${item.id} que vous voulez supprimer n'existe pas`)
        await order.destroy()
        return res.status(200).send(item)
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
        if(req.body.isExpired) {
            order.isExpired = req.body.isExpired
        }
        await order.save()
        const updatedOrder = await Commande.findByPk(order.id, {
            include: [UserAdresse, Plan, CartItem, Facture, Contrat]
        })
        return res.status(200).send(updatedOrder)
    } catch (e) {
        next(e.message)
    }
}

getOrdersByUser = async (req,res, next) => {
    const transaction = await db.sequelize.transaction()
    try{

    const token = req.headers['x-access-token']
        if(token === 'null') return res.status(200).send([])
    const user = decoder(token)
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
    try {
    const orders = await Commande.findAll({
        where: {userId: 1 },
        include: [
                 UserAdresse,Plan, CartItem, Facture, Contrat
        ],
    })
        res.status(200).send(orders)
    } catch (e) {
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
        const justUpdated = await Commande.findByPk(orderId,{
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