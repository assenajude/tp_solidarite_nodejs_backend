const db = require('../../db/models')
const Commande = db.Commande;


createContrat = async (req, res, next) => {
    const orderId = req.body.orderId
    try {
        let order = await Commande.findByPk(orderId)
        if(!order) return res.status(`La commande d'id ${orderId} n'existe pas`)
        const newContrat = await order.createContrat({
            dateDebut: req.body.debut,
            dateFin: req.body.fin,
            dateCloture: req.body.cloture,
            montant: req.body.montant,
            mensualite: req.body.nbMensualite,
            status: req.body.status
        })
        return res.status(201).send(newContrat)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    createContrat,

}