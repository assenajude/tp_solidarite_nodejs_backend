const db = require('../../db/models')
const {getParrainsTokens} = require('../utilities/getParrainsTokens')
const {sendPushNotification} = require('../utilities/pushNotification')
const Facture = db.Facture
const Tranche = db.Tranche
const Commande = db.Commande
const CompteParrainage = db.CompteParrainage

const decoder = require('jwt-decode')
const isAdmin = require('../utilities/checkAdminConnect')

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
        next(e.message)
    }
}

updateTranche = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    const userIsAdmin = isAdmin(user)
    let payedState =''
    if(userIsAdmin) {
       payedState = 'confirmed'
    } else {
        payedState = 'pending'
    }
    try {
        let tranche = await Tranche.findByPk(req.body.id, {
            include: Facture
        })
        if(!tranche)return res.status(404).send(`Impossible de trouver la tranche d'id ${req.body.id}`)
        await tranche.update({
            solde: req.body.montant,
            payed: true,
            payedState
        })
        const selectedOrder = await Commande.findByPk(tranche.Facture.OrderId, {
            include: CompteParrainage
        })
        if(selectedOrder && selectedOrder.CompteParrainage && selectedOrder.CompteParrainage.length>0) {
            const parrainsTokens = await getParrainsTokens(selectedOrder.CompteParrainage)
            if(parrainsTokens && parrainsTokens.length>0) {
                sendPushNotification(`Un payement est en cours sur la commande n° ${selectedOrder.numero} que vous avez parrainée.`, parrainsTokens, `Payement tranche commande n° ${selectedOrder.numero}`, {notifType: 'parrainage', info: 'order'})
            }
        }
        res.status(200).send(tranche)
    } catch (e) {
        next(e.message)
    }
}

getAllTranches = async (req, res, next) => {
    try {
        const tranches = await Tranche.findAll()
        res.status(200).send(tranches)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    createTranche,
    updateTranche,
    getAllTranches
}