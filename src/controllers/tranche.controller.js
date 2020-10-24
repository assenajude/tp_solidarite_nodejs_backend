const db = require('../models/index')
const Facture = db.facture
const Tranche = db.tranche

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
    try {
        let facture = await Facture.findByPk(req.body.factureId)
        if(!facture)return res.status(404).send(`Impossible de trouver la facture d'id ${req.body.factureId}`)
        let tranche = await Tranche.findByPk(req.body.id)
        if(!tranche)return res.status(404).send(`Impossible de trouver la tranche d'id ${req.body.id}`)
        await tranche.update({
            solde: req.body.montant,
            payed: true
        })
        await facture.increment('solde', {by:req.body.montant})
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