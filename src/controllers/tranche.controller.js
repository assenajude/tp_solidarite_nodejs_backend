const db = require('../../db/models')
const {getParrainsTokens} = require('../utilities/getParrainsTokens')
const {sendPushNotification} = require('../utilities/pushNotification')
const Facture = db.Facture
const Tranche = db.Tranche
const Commande = db.Commande
const User = db.User
const CompteParrainage = db.CompteParrainage


const createTranche = async (req, res, next) => {
    const factureId = req.body.factureId
    try{
        let facture = await Facture.findByPk(factureId)
        if(!facture) return  res.status(404).send(`la facture d'id ${factureId} n'a pas été trouvé`)
        const trancheData = {
            dateEmission: req.body.dateEmission,
            dateEcheance: req.body.dateEcheance,
            montant: req.body.montant
        }
        let newTranche = await facture.createTranche(trancheData)
        const factureTranches = await facture.getTranches()
        newTranche.numero = `${facture.numero}TRCH${factureTranches.length}`
        await newTranche.save()
        return res.status(201).send(newTranche)
    } catch (e) {
        next(e)
    }
}

updateTranche = async (req, res, next) => {
    try {
        let tranche = await Tranche.findByPk(req.body.id, {
            include: Facture
        })
        if(!tranche)return res.status(404).send(`Impossible de trouver la tranche d'id ${req.body.id}`)
        const selectedFacture = await Facture.findByPk(tranche.FactureId)
        const selectedOrder = await Commande.findByPk(selectedFacture.CommandeId, {
            include: CompteParrainage
        })
        if(req.body.validation) {
            if(tranche.montant === tranche.solde) {
                tranche.payedState ='confirmed'
                tranche.payed=true
                const orderUser = await User.findByPk(selectedOrder.UserId)
                const userName = orderUser.username?orderUser.username : orderUser.nom?orderUser.nom : orderUser.email
                if(orderUser && orderUser.pushNotificationToken) {
                    sendPushNotification(`Bonjour ${userName}, le payement de la tranche ${tranche.numero} de votre facture ${tranche.Facture.numero} a été confirmé.`, [orderUser.pushNotificationToken], `Confirmation payement tranche ${tranche.numero}`, {notifType: 'Facture', id:tranche.Facture.id})
                }
            }else {
                return res.status(403).send({message: "le solde de la tranche est insuffisant."})
            }
        }else {
            tranche.solde += req.body.montant
            tranche.payedState = 'pending'
        }
        await tranche.save()
        if(selectedOrder && selectedOrder.CompteParrainage && selectedOrder.CompteParrainage.length>0) {
            const parrainsTokens = await getParrainsTokens(selectedOrder.CompteParrainage)
            if(parrainsTokens && parrainsTokens.length>0) {
                sendPushNotification(`Un payement est en cours sur la commande n° ${selectedOrder.numero} que vous avez parrainée.`, parrainsTokens, `Payement tranche commande n° ${selectedOrder.numero}`, {notifType: 'parrainage', info: 'order'})
            }
        }
        res.status(200).send(tranche)
    } catch (e) {
        next(e)
    }
}

getAllTranches = async (req, res, next) => {
    try {
        const tranches = await Tranche.findAll()
        res.status(200).send(tranches)
    } catch (e) {
        next(e)
    }
}


module.exports = {
    createTranche,
    updateTranche,
    getAllTranches
}