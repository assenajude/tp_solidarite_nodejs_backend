const decoder = require('jwt-decode')
const db = require('../../db/models/index')
const Proposition = db.Proposition

const User = db.User

const newProposition = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    const {designation,type, idReference,isOk,propImagesLinks, ...otherProps} = req.body
    const propOptions = []
    for(key in otherProps) {
        propOptions.push({label: key, value: otherProps[key]})
    }
    const propositionData = {
        designation,
        description: propOptions,
        dateAchat: Date.now(),
        imagesProposition: req.body.propImagesLinks
    }
    try {
    let connectedUser = await User.findByPk(user.id)
        if(!connectedUser) return res.status(401).send('Veuillez vous connecter pour faire la proposition')
        const proposition = await connectedUser.createProposition(propositionData)
        return res.status(201).send(proposition)
    }catch (e) {
        next(e)
    }
}

const getAllProposition = async (req, res, next) => {
    try{
        const allPropositions = await Proposition.findAll()
        return res.status(200).send(allPropositions)
    } catch (e) {
        next(e)
    }
}

const editProposition = async (req, res, next) => {
    const {designation,propImagesLinks,isOk,idReference,type,id,...optionsList} = req.body
    const optionsTab = []
    for(key in optionsList) {
        optionsTab.push({label: key,value: optionsList[key]})
    }

    try {
        let proposition = await Proposition.findByPk(req.body.id)
        if(!proposition) return res.status(404).send("introuvable...")
        const updated = await proposition.update({
            designation: req.body.designation,
            description: optionsTab,
            imagesProposition: propImagesLinks,
            isOk: req.body.isOk,
            referenceId: req.body.idReference,
            typeReference: req.body.type
        })
        const allUser = await User.findAll()
        for(let i = 0; i<allUser.length; i++) {
            let newUser = allUser[i];
            (async function (currentUser) {
                currentUser.propositionCompter += 1
                await currentUser.save()
            })(newUser)
        }
        return res.status(200).send(updated)
    } catch (e) {
        next(e)
    }
}

module.exports = {
    newProposition,
    getAllProposition,
    editProposition
}