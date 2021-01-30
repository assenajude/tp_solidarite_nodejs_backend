const decoder = require('jwt-decode')
const db = require('../../db/models/index')
const Op = db.Sequelize.Op
const Facture = db.Facture
const Commande = db.Commande
const Tranche = db.Tranche
const User = db.User

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
        const data = req.body
        let facture = await Facture.findByPk(data.id)
        if(!facture) return res.status(404).send(`La facture d'id ${req.body.id} n'a pas été trouée`)
        facture.solde += data.solde
        const ratio = facture.solde / facture.montant
        facture.ratio = ratio
        //facture.ratio = Number(ratio.toFixed(2))
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
    if(!token || token === 'null')return  res.status(404).send('Utilisateur non connecté')
    try{
        const user = decoder(token)
       const userOrders = await Commande.findAll({
           where: {UserId: user.id}
       })
        const userOrdersIds = userOrders.map(order => order.id)
        const userFactures = await Facture.findAll({
           where: {
               CommandeId: {
                   [Op.in]: userOrdersIds
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