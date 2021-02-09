const decoder = require('jwt-decode')
const db = require('../../db/models/index')
const Op = db.Sequelize.Op
const Facture = db.Facture
const Commande = db.Commande
const Tranche = db.Tranche
const checkConnectedUser = require('../utilities/checkAdminConnect')

const createFacture = async (req, res, next)=> {
    try {
        let commande = await Commande.findByPk(req.body.orderId)
        if(!commande) return res.status(404).send(`La commande d'id ${req.body.orderId} n'existe pas. Merci de le creer.`)

        const facture = await commande.createFacture({
            numero: commande.numero+'b',
            dateDebut: req.body.debut,
            dateFin: req.body.fin,
            montant: req.body.montant,
            typeFacture: req.body.type
        })
        res.status(201).send(facture)
    } catch (e) {
        next(e.message)
    }
}

updateFacture = async (req, res, next) => {
    try {
        const data = req.body
        let facture = await Facture.findByPk(data.id)
        if(!facture) return res.status(404).send(`La facture d'id ${req.body.id} n'a pas été trouée`)
        facture.solde += data.solde
        const ratio = facture.solde / facture.montant
        facture.ratio = ratio
        if(facture.solde === facture.montant) {
           facture.dateCloture = Date.now()
           facture.ratio = 1
           facture.status = 'soldé'
        }
        await facture.save()
        const justUpdated = await Facture.findByPk(facture.id, {
            include: Tranche
        })
        return res.status(200).send(justUpdated)
    } catch (e) {
        next(e.message)
    }
}

getUserFactures = async (req,res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    const isAdmin = checkConnectedUser(user)
    let userFactures = []
    try{
        if(isAdmin) {
            userFactures = await Facture.findAll({
                include: [Commande, Tranche]
            })
        } else {
       const userOrders = await Commande.findAll({
           where: {UserId: user.id}
       })
        const userOrdersIds = userOrders.map(order => order.id)
         userFactures = await Facture.findAll({
           where: {
               CommandeId: {
                   [Op.in]: userOrdersIds
               }
           },
           include: [Commande, Tranche]
       })
        }
        res.status(200).send(userFactures)
    }catch (e) {
        next(e.message)
    }
}


module.exports = {
    createFacture,
    updateFacture,
    getUserFactures
}