const decoder = require('jwt-decode')
const db = require('../../db/models/index')
const Op = db.Sequelize.Op
const Facture = db.Facture
const User = db.User
const Commande = db.Commande
const Tranche = db.Tranche
const OrderParrain = db.OrderParrain
const CompteParrainage = db.CompteParrainage
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
        let user = await User.findByPk(commande.UserId)
        user.factureCompter += 1
        await user.save()
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
            const selectedOrder = await Commande.findByPk(facture.CommandeId)
            const orderParrainages = await selectedOrder.getCompteParrainages()
            const montantParraine = selectedOrder.montant - selectedOrder.interet

            for(let i = 0; i < orderParrainages.length; i++) {
                const newCompte = orderParrainages[i];
                (async function (currentCompte) {
                    let selectedOrderParrain = await OrderParrain.findOne({
                        where :{
                            CommandeId: selectedOrder.id,
                            CompteParrainageId: currentCompte.id
                        }
                    })
                    selectedOrderParrain.ended = true
                    await selectedOrderParrain.save()
                    const actionPercent = selectedOrderParrain.action * 100 / montantParraine
                    const gain = actionPercent * selectedOrder.interet / 100
                    const aroundGain = Math.round(gain)
                    let selectedCompteParrainage = await CompteParrainage.findByPk(currentCompte.id)
                    selectedCompteParrainage.quotite += selectedOrderParrain.action
                    selectedCompteParrainage.depense -=  selectedOrderParrain.action
                    selectedCompteParrainage.gain += aroundGain
                    await selectedCompteParrainage.save()
                })(newCompte)
            }
        }
        await facture.save()
        const justUpdated = await Facture.findByPk(facture.id, {
            include: [Commande,Tranche]
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

const getAllFacture = async (req, res, next) => {
    try{
        const allFactures = await Facture.findAll({
            include: [Commande, Tranche]
        })
        return res.status(200).send(allFactures)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    createFacture,
    updateFacture,
    getUserFactures,
    getAllFacture
}