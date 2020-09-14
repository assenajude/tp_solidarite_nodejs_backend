
const db = require('../models/index');
const Commande = db.commande;
const UserAdresse = db.userAdresse;
const ShoppingCart = db.shoppingCart
const Plan = db.plan;
const User = db.user
const OrderItem = db.orderItem
const CartItem = db.cartItem

const saveOrder = async (req, res, next) => {
   try{
    /*   const shoppingCart = await ShoppingCart.findByPk(shoppingCartId)
       const items = await shoppingCart.getCartItems();*/
        let items = []
        let user = await User.findByPk(req.body.userId)
       const userAdresse = await UserAdresse.findByPk(req.body.userAdresseId)
       const plan = await Plan.findByPk(req.body.planId)
       let order = await user.createCommande({
           itemsLength: req.body.itemsLength,
           interet: req.body.interet,
           fraisTransport: req.body.fraisTransport,
           montant: req.body.montant
       })
       await order.setUserAdresse(userAdresse)
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
       res.status(201).send(order)
    } catch (e) {
        next(e.message)

    }
}

getAllOrder = async (req, res, next) => {
    try {
    const orders = await Commande.findAll({
        include: [User, UserAdresse, Plan, CartItem]
    })
        res.status(200).send(orders)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    saveOrder,
    getAllOrder
}