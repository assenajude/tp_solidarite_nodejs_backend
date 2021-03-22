const db = require('../../db/models');
const CompteParrainage = db.CompteParrainage
const ParrainFilleul = db.ParrainFilleul
const Commande = db.Commande
const User = db.User
const OrderParrain = db.OrderParrain
const Op = db.Sequelize.Op
const decoder = require('jwt-decode')
const isAdmin = require('../utilities/checkAdminConnect')

const createCompteParrainage = async (req, res, next) => {
    const idUser = req.body.userId
    const data = {
        initial: 5,
        gain: 0,
        depense: 0,
        quotite: 0,
        active: false,
        compteState: 'pending'
    }

    try {
        let connectedUser = await User.findByPk(idUser)
        if(!connectedUser) return res.status(404).send("le compte d'utilisateur n'a pas été trouvé")
        const newCompteParrain = await connectedUser.createCompteParrainage(data)
        const newAdded = await CompteParrainage.findByPk(newCompteParrain.id, {
            include:  [{model: User, attributes:{exclude: ['password']}}]
        })
        return res.status(201).send(newAdded)
    } catch (e) {
        next(e.message)
    }
}

const editInitialFund = async (req, res, next) => {
    try {
        let selectedCompte = await CompteParrainage.findByPk(req.body.id)
        if(!selectedCompte) return res.status(404).send("Le compte n'a pas été trouvé")
        selectedCompte.initial += req.body.initial
        selectedCompte.active = false
        selectedCompte.compteState = 'pending'
        await selectedCompte.save()
        return res.status(200).send(selectedCompte)
    } catch (e) {
        next(e.message)
    }
}

const editQuotiteFund = async (req, res, next) => {
    const quotite = req.body.quotite
    try {
        let selectedCompte = await CompteParrainage.findByPk(req.body.id)
        const solde = selectedCompte.initial+selectedCompte.gain-selectedCompte.depense
        if(quotite > solde) return res.status(400).send("Quotité superieure au solde")
        selectedCompte.quotite = quotite
        await selectedCompte.save()
        return res.status(200).send(selectedCompte)
    } catch (e) {
        next(e.message)
    }
}

const activeParrainCompte = async (req, res, next) => {
    try {
        let selectedParrainCompte = await CompteParrainage.findByPk(req.body.id)
        if(!selectedParrainCompte) return res.status(404).send("Le compte de parrainage n'existe pas ")
        selectedParrainCompte.active = true
        selectedParrainCompte.compteState = 'working'
        await selectedParrainCompte.save()
        return res.status(200).send(selectedParrainCompte)
    } catch (e) {
        next(e.message)
    }
}


const getUserCompte = async (req, res, next) => {
    const userToken = req.headers['x-access-token']
    const user = decoder(userToken)
    const isUserAdmin = isAdmin(user)

    try {
        let comptes;
        if(isUserAdmin){
            comptes = await CompteParrainage.findAll({
                include: [{model: User, attributes:{exclude: ['password']}}]
            })
        } else {
            comptes = await CompteParrainage.findAll({
            where: {UserId: user.id},
                include: [{model: User, attributes:{exclude: ['password']}}]
        })

        }
        return res.status(200).send(comptes)
    } catch (e) {
        next(e.message)
    }
}
const getAllParrainCompte = async (req, res, next) => {
    try {
        const allParrains = await CompteParrainage.findAll({
            include: [{model:User,attributes:{exclude: ['password']}}]
        })
        return res.status(200).send(allParrains)
    } catch (e) {
        next(e.message)
    }
}

const getUserParrainageData = async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(req.body.userId)
        const userParrains = await currentUser.getParrains({attributes: {exclude: ['password']}})
        const parrainsIds = userParrains.map(item => item.id)
        const userParrainsComptes = await CompteParrainage.findAll({
            where: {
                UserId: {
                    [Op.in]: parrainsIds
                }
            },
            include: [{model: User, attributes:{exclude: ['password']}}, Commande]
        })

        const userFilleuls = await currentUser.getFilleuls({attributes: {exclude: ['password']}})
        const filleulsIds = userFilleuls.map(item => item.id)
        const userFilleulsComptes = await CompteParrainage.findAll({
            where: {
                UserId: {
                    [Op.in]: filleulsIds
                }
            },
            include: [{model: User, attributes:{exclude: ['password']}}, Commande]
        })
        const userParrainsStates = {parrainsUser: userParrains, filleulsUser: userFilleuls}
        const data = {parrains: userParrainsComptes, filleuls: userFilleulsComptes, parrainageState: userParrainsStates}
        return res.status(200).send(data)
    } catch (e) {
        next(e.message)
    }
}

const respondToParrainageMessage = async (req, res, next) => {
    try {
        let selectedFilleulCompte = await ParrainFilleul.findOne({
           where: {
               parrainId: req.body.UserId
           }
        })
        selectedFilleulCompte.inSponsoring = true
        selectedFilleulCompte.sponsoringState = 'working'
        await selectedFilleulCompte.save()
        const allParrainageComptes = await CompteParrainage.findAll({
            include: [{model:User,attributes:{exclude: ['password']}}]
        })
        return res.status(200).send(allParrainageComptes)
    } catch (e) {
        next(e.message)
    }
}

const getParrainageStopped = async (req, res, next) => {
    try {
        let selectedCompte = await CompteParrainage.findByPk(req.body.id)
        const compteOrders = await OrderParrain.findAll({
            where: {
                CompteParrainageId: selectedCompte.id
            }
        })
        const checkParrainageOrder = compteOrders.some(order => order.OrderParrain.ended === false)
        if(checkParrainageOrder) return res.status(403).send("Des commandes sont encours pour ce compte")
        let selectedParrainFilleul = await ParrainFilleul.findOne({
            where: {
                [Op.or]: [{filleulId: req.body.UserId}, {parrainId: req.body.UserId}]
            }
        })
        selectedParrainFilleul.inSponsoring = false
        selectedParrainFilleul.sponsoringState = 'pending'
        await selectedParrainFilleul.save()
        const allCompte = await CompteParrainage.findAll({
            include: [{model:User,attributes:{exclude: ['password']}}]
        })
        return res.status(200).send(allCompte)
    } catch (e) {
        next(e.message)
    }
}

const getParrainageOrders = async (req, res, next) => {
    try {
        const selectedCompte = await CompteParrainage.findOne({
            where: {
                UserId: req.body.userId
            }
        })
        const compteParrain = await CompteParrainage.findAll({
            where: {
                UserId: req.body.userId
            },
            include:Commande
        })
        const compteOrders = await selectedCompte.getCommandes()
        return res.status(200).send(compteOrders)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    createCompteParrainage,
    editInitialFund,
    editQuotiteFund,
    getUserCompte,
    activeParrainCompte,
    getAllParrainCompte,
    getUserParrainageData,
    respondToParrainageMessage,
    getParrainageStopped,
    getParrainageOrders

}