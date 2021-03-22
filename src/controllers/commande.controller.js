
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
const Message = db.Message
const Livraison = db.Livraison
const CompteParrainage = db.CompteParrainage
const sendMessage = require('../utilities/sendMessage')


const saveOrder = async (req, res, next) => {
    try{
    const token = req.headers['x-access-token']
        if(token=== 'null' || !token) return res.status(404).send('Impossible de passer la commande')
      const connectedUser = decoder(token)
        const currentOrder = req.body.order
        let items = []
        let statusAccord = '';
        let user = await User.findByPk(connectedUser.id)
        if(!user) return res.status(404).send("l'utlisateur n'a pas été trouvé")
        const userAdresse = await UserAdresse.findByPk(currentOrder.userAdresseId, )
        const plan = await Plan.findByPk(currentOrder.planId, {include: Payement})
        const modePayement = plan.Payement.mode
        if(modePayement.toLowerCase() === 'cash') {
            statusAccord = 'Accepté'
        } else {
            statusAccord = 'traitement en cours'
        }
        const allSaved = await Commande.findAll();
        const ordersNums = allSaved.map(order => order.numero)
        const min = 1000000000
        const max = 9999999999
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        let lastCheck = false
        do {
        ordersNums.forEach(num => {
                const newCheck = randomNumber === num
                lastCheck = lastCheck || newCheck
            })
        }while (lastCheck)
       let order = await user.createCommande({
           numero: `tpsodr${randomNumber}`,
           itemsLength: currentOrder.itemsLength,
           interet: currentOrder.interet,
           fraisTransport: currentOrder.fraisTransport,
           montant: currentOrder.montant,
           dateLivraisonDepart: currentOrder.dateLivraisonDepart,
           typeCmde: currentOrder.typeCmde,
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

       items = currentOrder.items

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

      let newAdded =  await Commande.findByPk(order.id, {
           include: [UserAdresse, Plan, CartItem, Facture, Contrat, Livraison],
           })

        if(modePayement.toLowerCase() === 'cash') {
            user.fidelitySeuil += newAdded.montant
            await user.save()
        }

        const parrainsTab = req.body.parrains
        for(let i = 0; i<parrainsTab.length; i++) {
            const newParrain = parrainsTab[i];
            (async function (parrain) {
                let selectParrain = await CompteParrainage.findByPk(parrain.id)
                selectParrain.quotite = parrain.quotite - parrain.parrainAction
                await selectParrain.save()
                newAdded.addCompteParrainage(selectParrain, {
                    through: {
                        action: parrain.parrainAction
                    }
                })

            })(newParrain)
        }
        // sendMail.orderSuccessMail(user,req.body.items, req.body.fraisTransport, req.body.interet, req.body.montant)
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
    let messageHeader;
    let messageContent;
    try{
        let order = await Commande.findByPk(req.body.orderId)
        const currentUser = await User.findByPk(order.UserId)
        const receiverName = currentUser.nom
        const receiverSubname = currentUser.prenom
        const receiverFullname = `${receiverName} ${receiverSubname}`
        let mainUser = await User.findByPk(1)
        if(!order) return res.status(404).send(`La commande que vous voulez modifier n'exite pas`)
        if (req.body.statusAccord) {
            order.statusAccord = req.body.statusAccord
            const {msgHeader, message} = sendMessage.accordMessage(req.body.statusAccord,receiverFullname, order.dateCmde)
            messageHeader = msgHeader
            messageContent = message
        }
        if (req.body.statusLivraison) {
        order.statusLivraison = req.body.statusLivraison
        order.dateLivraisonFinal = Date.now()
            const {msgHeader, message} = sendMessage.livraisonMessage(req.body.statusLivraison, currentUser, order.numero)
            messageHeader = msgHeader
            messageContent = message
        }
        if(req.body.history) order.historique = req.body.history

        if(req.body.isExpired) {
            order.isExpired = req.body.isExpired
            const {msgHeader, message} = sendMessage.expiredMessage(currentUser, order.numero)
            messageHeader = msgHeader
            messageContent = message
        }

        if(req.body.expireIn) {
            order.expireIn = req.body.expireIn
            const {msghHeader, message} = sendMessage.expireInMessage(currentUser, order.numero, req.body.expireIn)
            messageHeader = msghHeader
            messageContent = message
        }
        let createdMessage = await Message.create({
            msgHeader: messageHeader,
            content: messageContent
        })

        await createdMessage.setSender(mainUser)
        await createdMessage.setReceiver(currentUser)
        createdMessage.reference = order.numero
        await createdMessage.save()
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
    let userOrders = []
    try{
        const token = req.headers['x-access-token']
        const user = decoder(token)
        const isAdmin = user.roles.indexOf('ROLE_ADMIN') !== -1
        if(isAdmin){
            userOrders = await Commande.findAll({include:[UserAdresse,Plan, CartItem, Facture, Contrat, Livraison],transaction})
        } else {
        userOrders = await Commande.findAll({
            where: {UserId: user.id},
            include: [
                UserAdresse,Plan, CartItem, Facture, Contrat, Livraison
            ],
            transaction
        })
        await transaction.commit()
        }
        return res.status(200).send(userOrders)
    } catch (e) {
        await transaction.rollback()
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
    updateOrder,
    deleteOrder,
    createOrderContrat,
    updateOrderContrat
}