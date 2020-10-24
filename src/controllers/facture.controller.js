const decoder = require('jwt-decode')
const db = require('../models/index')
const Op = db.Sequelize.Op
const Facture = db.facture
const Commande = db.commande
const Tranche = db.tranche

const createFacture = async (req, res, next)=> {
    try {
        let commande = await Commande.findByPk(req.body.orderId)
        if(!commande) return res.status(404).send(`La commande d'id ${req.body.orderId} n'existe pas. Merci de le creer.`)

        const facture = await commande.createFacture({
            dateDebut: req.body.debut,
            dateFin: req.body.fin,
            montant: req.body.montant,
            typeFacture: req.body.type
        })
        const allSavedFacture = await Facture.findAll()
        facture.numero = `TPSBLL0000${allSavedFacture.length}`,
        await facture.save()
        res.status(201).send(facture)
    } catch (e) {
        next(e.message)
    }
}

updateFacture = async (req, res, next) => {
    try {
        let facture = await Facture.findByPk(req.body.id)
        if(!facture) return res.status(404).send(`La facture d'id ${req.body.id} n'a pas été trouée`)
        facture.solde = req.body.montant
        await facture.save()
        return res.status(200).send(facture)
    } catch (e) {
        next(e.message)
    }
}

getAllFactures = async (req, res, next) => {
    try {
        const factures = await Facture.findAll({
            include: [
                Commande,
                Tranche
            ]
        })
        res.status(200).send(factures)
    } catch (e) {
        next(e.message)
    }
}

getUserFactures = async (req,res, next) => {
    const token = req.headers['x-access-token']
    let user;
    if(token) {
        user = decoder(token)
    } else return res.status(404).send('Utilisateur non connecté')
    try{
        const allOrders = await Commande.findAll({
            where: {userId: user.id}
        })
        const ordersIds = allOrders.map(item => item.id)
        const userFactures = await Facture.findAll({
            where: {
                commandeId: {
                    [Op.in]: ordersIds
                }
            },
            include: [Commande, Tranche]
        })

        res.status(200).send(userFactures)
    }catch (e) {
        next(e.message)
    }
}


module.exports = {
    createFacture,
    getAllFactures,
    updateFacture,
    getUserFactures
}