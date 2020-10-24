
const db = require('../models/index');
const decoder = require('jwt-decode')
const Commande = db.commande;
const UserAdresse = db.userAdresse;
const Plan = db.plan;
const User = db.user
const CartItem = db.cartItem
const Facture = db.facture
const Contrat = db.contrats

const saveOrder = async (req, res, next) => {
    try{
        let items = []
        let user = await User.findByPk(req.body.userId)
        let userAdresse
        if(req.body.userAdresseId) {
        userAdresse = await UserAdresse.findByPk(req.body.userAdresseId)
        }
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
       await order.setPlan(plan)
       items = req.body.items
       for(let i = 0; i < items.length; i++) {
           (function (i) {
               let newItem = items[i];
               (async function(item) {
                   const [cartItem, created] = await CartItem.findOrCreate({
                       where: {
                         libelle: item.libelle
                       },
                       defaults: {
                           libelle: item.libelle,
                           image: item.image,
                           prix: item.prix
                       }
                   })
                   await order.addCartItem(cartItem, {
                       through: {
                           quantite: item.quantite,
                           montant: item.montant
                       }
                   })
               })(newItem)
           })(i)
       }
       await order.reload({
           include: [UserAdresse, Plan, CartItem, Facture, Contrat]
       })
       res.status(201).send(order)
    } catch (e) {
        next(e.message)

    }
}

deleteOrder = async (req, res, next) => {
    const orderId = req.body.id
    try {
        const order = await Commande.findByPk(orderId)
        if(!order) return res.status(404).send(`La commande d'id ${orderId} que vous voulez supprimer n'existe pas`)
        await order.destroy()
        res.status(200).send(order)
    } catch (e) {
        next(e.message)
    }
}

updateOrder = async (req, res, next) => {
    try{
        let order = await Commande.findByPk(req.body.orderId)
        if(!order) return res.status(404).send(`La commande que voulez modifier n'exite pas`)

        if (req.body.dateLivraisonFinal) {
        order.dateLivraisonFinal = req.body.dateLivraisonFinal
        }
        if (req.body.statusAccord) {
        order.statusAccord = req.body.statusAccord
        }
        if (req.body.statusLivraison) {
        order.statusLivraison = req.body.statusLivraison
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
    try{
        const userOrders = await Commande.findAll({
            where: {userId: user.id},
            include: [UserAdresse, Plan, CartItem, Facture, Contrat]
        })

        return res.status(200).send(userOrders)
    } catch (e) {
        next(e.message)
    }
}

getAllOrder = async (req, res, next) => {
    try {
    const orders = await Commande.findAll({
        where: {userId: 1 },
        include: [
                 UserAdresse,Plan, CartItem, Facture, Contrat
            // User, UserAdresse, Plan, CartItem, Facture, contrats
        ]
    })
        res.status(200).send(orders)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    getOrdersByUser,
    saveOrder,
    getAllOrder,
    updateOrder,
    deleteOrder
}