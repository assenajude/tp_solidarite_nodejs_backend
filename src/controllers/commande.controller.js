
const db = require('../../db/models/index');
const decoder = require('jwt-decode')
const generateRandom = require('../utilities/generateRandom')
const {sendPushNotification} = require('../utilities/pushNotification')
const {getParrainsTokens} = require('../utilities/getParrainsTokens')
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
const Livraison = db.Livraison
const CompteParrainage = db.CompteParrainage


const saveOrder = async (req, res, next) => {
    const cashback = req.body.order.cashback
    try{
    const token = req.headers['x-access-token']
        if(token=== 'null' || !token) return res.status(404).send('Impossible de passer la commande')
      const connectedUser = decoder(token)
        const currentOrder = req.body.order
        let items = []
        let statusAccord = '';
        let user = await User.findByPk(connectedUser.id)
        if(!user) return res.status(404).send("l'utlisateur n'a pas été trouvé")
        let userAdresse;
        if(currentOrder.userAdresseId) {
          userAdresse = await UserAdresse.findByPk(currentOrder.userAdresseId)
        }
        const plan = await Plan.findByPk(currentOrder.planId, {include: Payement})
        const modePayement = plan.Payement.mode
        let accordDate;
        if(modePayement.toLowerCase() === 'cash') {
            statusAccord = 'Accepté'
            accordDate = new Date()

        } else {
            statusAccord = 'traitement en cours'
        }
        const allSaved = await Commande.findAll();
        const ordersNums = allSaved.map(order => order.numero)
        const min = 1000000
        const max = 9999999
        const randomNumber = generateRandom(min, max)
        let lastCheck = false
        do {
        ordersNums.forEach(num => {
                const newCheck = randomNumber === num
                lastCheck = lastCheck || newCheck
            })
        }while (lastCheck)
        const endedLetter =currentOrder.typeCmde === 'article'?'a': currentOrder.typeCmde === 'location'?'l' : 's'
       let order = await user.createCommande({
           numero: `sc${randomNumber}${endedLetter}`,
           itemsLength: currentOrder.itemsLength,
           interet: currentOrder.interet,
           fraisTransport: currentOrder.fraisTransport,
           montant: currentOrder.montant,
           dateLivraisonDepart: currentOrder.dateLivraisonDepart,
           typeCmde: currentOrder.typeCmde,
           statusAccord,
           accordValidationDate : accordDate
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
                           productId: item.id,
                           productType: item.typeCmde,
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
            user.articleCompter+=1
            await userShoppingCart.setArticles([])
        } else if(order.typeCmde === 'location') {
            let selectedLocation = await Location.findByPk(items[0].id)
            selectedLocation.qteDispo -= items[0].quantite
            user.locationCompter +=1
            await selectedLocation.save()
            await userShoppingCart.setLocations([])
        } else {
            user.serviceCompter += 1
            await userShoppingCart.setServices([])
        }

        userShoppingCart.cartLength = 0
        userShoppingCart.cartAmount = 0
        await userShoppingCart.save()

      let newAdded =  await Commande.findByPk(order.id, {
           include: [UserAdresse, Plan, CartItem, Facture, Contrat, Livraison,CompteParrainage, {model: User, attributes:{exclude: ['password']}}],
           })

        if(modePayement.toLowerCase() === 'cash') {
            user.cashback += cashback
            if(plan.libelle.toLowerCase() === 'cash prime') {
                user.fidelitySeuil += newAdded.montant
            }
        }
        if(modePayement.toLowerCase() === 'credit' && req.body.order.couverture === 'fidelity') {
            user.fidelitySeuil = 0
        }
        await user.save()
        const parrainsTab = req.body.parrains
        const parrainsTokens = []
        for(let i = 0; i<parrainsTab.length; i++) {
            const newParrain = parrainsTab[i];
            (async function (parrain) {
                if(parrain.User.pushNotificationToken) parrainsTokens.push(parrain.User.pushNotificationToken)
                let selectParrain = await CompteParrainage.findByPk(parrain.id)
                selectParrain.quotite -= parrain.parrainAction
                selectParrain.depense += parrain.parrainAction
                await selectParrain.save()
                newAdded.addCompteParrainage(selectParrain, {
                    through: {
                        action: parrain.parrainAction
                    }
                })

            })(newParrain)
        }
        const userData = user.username?user.username : user.email?user.email : ''
        if(user.pushNotificationToken) {
            sendPushNotification(`Felication ${userData}, votre commande n° ${newAdded.numero} a été reçue et est en cours de traitement.`, [user.pushNotificationToken], 'Commande reçue', {notifType: 'order', orderId:newAdded.id})
        }
        if(parrainsTokens.length>0) {
            sendPushNotification(`Vous avez été sollicité par ${userData} pour parrainer sa commande n° ${newAdded.numero}`, parrainsTokens, `Parrainage commande n° ${newAdded.numero}`, {notifType: 'parrainage', info: 'order'})
        }
       return  res.status(200).send(newAdded)
    } catch (e) {
        next(e)

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
        next(e)
    }
}

updateOrder = async (req, res, next) => {
    try{
        let order = await Commande.findByPk(req.body.orderId)
        let currentUser = await User.findByPk(order.UserId)
        if(!order) return res.status(404).send(`La commande que vous voulez modifier n'exite pas`)
        if (req.body.statusAccord) {
            order.statusAccord = req.body.statusAccord
            order.accordValidationDate = new Date()
        }
        if (req.body.statusLivraison) {
        order.statusLivraison = req.body.statusLivraison
        order.dateLivraisonFinal = Date.now()
        }
        if(req.body.history) order.historique = req.body.history

        if(req.body.isExpired) {
            order.isExpired = req.body.isExpired
        }
        await order.save()
        const updatedOrder = await Commande.findByPk(order.id, {
            include: [UserAdresse,CompteParrainage, Plan, CartItem, Facture, Contrat, {model: User, attributes: {exclude: 'password'}}]
        })
        if(currentUser.pushNotificationToken) {
            sendPushNotification(`Votre commande ${updatedOrder.numero} a été mise à jour.`, [currentUser.pushNotificationToken], 'Commande mise à jour', {notifType: 'order', id: updatedOrder.id})
        }
        const parrainageComptes = updatedOrder.CompteParrainages
        if(parrainageComptes && parrainageComptes.length>0) {
            const parrainsTokens = await getParrainsTokens(parrainageComptes)
            if(parrainsTokens && parrainsTokens.length>0) {
                sendPushNotification(`Bonjour la commande n° ${updatedOrder.numero} que vous avez parrainée a été modifiée.`,parrainsTokens, `Modification commande n° ${updatedOrder.numero}`, {notifType: 'parrainage', info: 'order'} )
            }
        }
        return res.status(200).send(updatedOrder)
    } catch (e) {
        next(e)
    }
}

getOrdersByUser = async (req,res, next) => {
    let userOrders = []
    try{
        const token = req.headers['x-access-token']
        const user = decoder(token)
        const isAdmin = user.roles.indexOf('ROLE_ADMIN') !== -1
        if(isAdmin){
            userOrders = await Commande.findAll(
                {include:[
                        UserAdresse,
                        Plan,
                        CartItem,
                        Facture,
                        Contrat,
                        Livraison,
                        CompteParrainage,
                        {model:User, attributes: {exclude: 'password'}}]})
        } else {
        userOrders = await Commande.findAll({
            where: {UserId: user.id},
            include: [
                UserAdresse,
                Plan,
                CartItem,
                Facture,
                Contrat,
                Livraison,
                CompteParrainage,
                {model:User, attributes: {exclude: 'password'}}
            ]
        })
        }
        return res.status(200).send(userOrders)
    } catch (e) {
        next(e)
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
            include: [
                UserAdresse,
                Plan,
                CartItem,
                Facture,
                Contrat,
                CompteParrainage,
                {model:User, attributes: {exclude: 'password'}}]
        })
        if(justUpdated.CompteParrainages && justUpdated.CompteParrainages.length>0) {
            const parrainsTokens = await getParrainsTokens(justUpdated.CompteParrainages)
            if(parrainsTokens && parrainsTokens.length>0) {
                sendPushNotification(`La commande n° ${justUpdated.numero} que vous avez parrainée est passée en contrat.`, parrainsTokens, `Contrat commande n° ${justUpdated.numero}`, {notifType: 'parrainage', info: 'order'})
            }
        }
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
            include: [UserAdresse,  Plan, CartItem, Contrat, Facture, CompteParrainage]
        })
        if(updatedOrder.CompteParrainages.length>0) {
            const parrainsTokens = await getParrainsTokens(updatedOrder.CompteParrainages)
            if(parrainsTokens && parrainsTokens.length>0) {
                sendPushNotification(`La commande n° ${updatedOrder.numero} qui était en contrat recemment a été modifiée.`, parrainsTokens, `Modification commande n° ${updatedOrder.numero}`, {notifType: 'parrainage', info: 'order'})
            }
        }
        return res.status(200).send(updatedOrder)

    } catch (e) {
        next(e.message)
    }
}

const getSectedOrder = async (req, res, next) => {
    try {
        const selectedOrder = await Commande.findByPk(req.body.orderId, {
            include: [UserAdresse,CompteParrainage, Plan, CartItem, Facture, Contrat, {model: User, attributes: {exclude: 'password'}}]
        })
        if(!selectedOrder) res.status(404).send({message: "Commande non trouvée"})
        return res.status(200).send(selectedOrder)
    }catch (e) {
        next(e)
    }
}


module.exports = {
    getOrdersByUser,
    saveOrder,
    updateOrder,
    deleteOrder,
    createOrderContrat,
    updateOrderContrat,
    getSectedOrder
}