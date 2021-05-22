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
            include:  [{model: User, attributes:{exclude: ['password']}}, Commande]
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
        const newUpdated = await CompteParrainage.findByPk(selectedCompte.id, {
            include: [{model: User, attributes: {exclude: 'password'}}, Commande]
        })
        return res.status(200).send(newUpdated)
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
        const justUpdated = await CompteParrainage.findByPk(selectedCompte.id, {
            include: [{model: User, attributes: {exclude: 'password'}}, Commande]
        })
        return res.status(200).send(justUpdated)
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
        const activatedCompte = await CompteParrainage.findByPk(selectedParrainCompte.id, {
            include: [{model: User, attributes: {exclude: 'password'}}, Commande]
        })
        return res.status(200).send(activatedCompte)
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
                include: [{model: User, attributes:{exclude: ['password']}}, Commande]
            })
        } else {
            comptes = await CompteParrainage.findAll({
                where: {UserId: user.id},
                include: [{model: User, attributes:{exclude: ['password']}}, Commande]
            })

        }
        return res.status(200).send(comptes)
    } catch (e) {
        next(e.message)
    }
}
const getAllParrainCompte = async (req, res, next) => {
    const userId = req.body.userId
    try {
        const allParrains = await CompteParrainage.findAll({
            include: [{model:User,attributes:{exclude: ['password']}}, Commande]
        })
        return res.status(200).send({comptes:allParrains, userId})
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
        const data = {parrains: userParrainsComptes, filleuls: userFilleulsComptes, userParrainsState:userParrains, userFilleulsState: userFilleuls}
        return res.status(200).send(data)
    } catch (e) {
        next(e.message)
    }
}

const sendParrainageRequest = async (req, res, next) => {
    try {
        const senderId = req.body.idSender
        const receiverId = req.body.idReceiver
        let sender = await User.findByPk(senderId)
        let receiver = await User.findByPk(receiverId)
        await sender.addParrain(receiver, {
            through: {
                messageSent: true,
                inSponsoring: false,
                sponsoringSate: 'pending'
            }
        })
        receiver.parrainageCompter += 1
        await receiver.save()
        const selectedCompte = await CompteParrainage.findByPk(req.body.id, {
            include: [{model: User, attributes: {exclude: 'password'}}, Commande]
        })
        const parrains = await sender.getParrains({
            attributes: {exclude: 'password'}
        })

        let updated = parrains.find(item => item.id === receiverId)
        const data = {compte: selectedCompte, parrain: updated, isParrain: true}
        return res.status(200).send(data)
    } catch (e) {
        next(e.message)
    }
}

const respondToParrainageMessage = async (req, res, next) => {

    try {
        let selectedFilleulCompte = await ParrainFilleul.findOne({
            where: {
                filleulId: req.body.UserId,
                parrainId: req.body.currentUserId
            }
        })
        selectedFilleulCompte.inSponsoring = true
        selectedFilleulCompte.sponsoringState = 'working'
        await selectedFilleulCompte.save()
        let selectedFilleulUser = await User.findByPk(req.body.UserId)
        selectedFilleulUser.parrainageCompter += 1
        await selectedFilleulUser.save()
        let selectedUser = await User.findByPk(req.body.currentUserId)
        selectedUser.parrainageCompter -= 1
        await selectedUser.save()
        const filleuls = await selectedUser.getFilleuls({
            attributes: {exclude: 'password'}
        })
        let updatedFilleul = filleuls.find(item => item.id === req.body.UserId)
        const updatedCompte = await CompteParrainage.findByPk(req.body.id, {
            include: [{model: User, attributes: {exclude: 'password'}}, Commande]
        })
        const data = {compte: updatedCompte, parrain:updatedFilleul, isFilleul: true}
        return res.status(200).send(data)
    } catch (e) {
        next(e.message)
    }
}

const getParrainageManaged = async (req, res, next) => {
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
                filleulId: {
                    [Op.or]:[req.body.senderId, req.body.receiverId]
                },
                parrainId: {
                    [Op.or]:[req.body.senderId, req.body.receiverId]
                }
            }
        })
        if(req.body.label === 'stop') {
            selectedParrainFilleul.inSponsoring = false
            selectedParrainFilleul.sponsoringState = 'stopped'
        }

        await selectedParrainFilleul.save()
        const selectedUserCompte = await User.findByPk(req.body.senderId)
        const userParrains = await selectedUserCompte.getParrains({
            attributes: {exclude: 'password'}
        })
        let itemIsParrain = userParrains.find(item => item.id === req.body.UserId)
        const userFilleuls = await selectedUserCompte.getFilleuls({
            attributes: {exclude: 'password'}
        })
        let isItemFilleul = userFilleuls.find(item => item.id === req.body.UserId)
        let updatedCompte;
        if(itemIsParrain) {
            updatedCompte = itemIsParrain
            if(req.body.label === 'remake') {
                await selectedUserCompte.removeParrain(itemIsParrain)
            }
        } else {
            updatedCompte = isItemFilleul
            if(req.body.label === 'remake') {
                await selectedUserCompte.removeFilleul(isItemFilleul)
            }
        }
        let isParrain;
        if(req.body.label === 'remake') {
            await selectedParrainFilleul.destroy()
            const selectedReceiver = await User.findByPk(req.body.receiverId)
            if(!selectedReceiver) return res.status(404).send("ce compte n'existe plus")
            await selectedUserCompte.addParrain(selectedReceiver, {
                through: {
                    messageSent: true,
                    inSponsoring: false,
                    sponsoringSate: 'pending'
                }
            })
            const newParrains = await selectedUserCompte.getParrains({
                attributes: {exclude: 'password'}
            })
            let ownerUser = User.findByPk(req.body.UserId)
            ownerUser.parrainageCompter += 1
            await ownerUser.save()
            updatedCompte = newParrains.find(parrain => parrain.id === req.body.receiverId)
            isParrain = true
        }

        const updatedParrainageCompte = await CompteParrainage.findByPk(req.body.id, {
            include: [{model: User, attributes: {exclude: 'password'}}, Commande]
        })
        const data = {compte: updatedParrainageCompte, parrain: updatedCompte, isParrain}
        return res.status(200).send(data)
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
    sendParrainageRequest,
    respondToParrainageMessage,
    getParrainageManaged

}