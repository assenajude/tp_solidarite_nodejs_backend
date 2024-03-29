const decoder = require('jwt-decode')
const db = require('../../db/models/index')
const Question = db.Question
const User = db.User
const Response = db.Response

const askQuestion = async (req, res, next) => {
    const token = req.headers["x-access-token"]
    const user = decoder(token)
    try {
        let connectedUser = await User.findByPk(user.id)
        if(!connectedUser)return res.status(404).send("Utilisateur introuvable")
        const newQuestion = await connectedUser.createQuestion({
            libelle: req.body.libelle
        })
        const newAdded = await Question.findByPk(newQuestion.id, {
            include: [Response, User]
        })
        return res.status(201).send(newAdded)

    } catch (e) {
        next(e)
    }
}

const editQuestion = async (req, res, next) => {
    try {
        let selectedQuestion = await Question.findByPk(req.body.id)
        if(!selectedQuestion)return res.status(404).send('la question nexiste pas')
        selectedQuestion.libelle = req.body.libelle
        selectedQuestion.isValid = req.body.isValid
        await selectedQuestion.save()
        return res.status(200).send(selectedQuestion)
    } catch (e) {

    }
}

const getAllQuestions = async (req, res, next) => {
    try {
    const allQuestions = await Question.findAll({
        include: [Response, User]
    })
        return res.status(200).send(allQuestions)
    } catch (e) {
        next(e)
    }

}

const giveResponse = async (req, res, next) => {
    try {
        let selectedQuestion = await Question.findByPk(req.body.questionId)
        if(!selectedQuestion) return res.status(404).send('La question nexiste pas')
        const response = await selectedQuestion.createResponse({
            content: req.body.content
        })
        const user = await User.findByPk(selectedQuestion.UserId)
        user.helpCompter += 1
        await user.save()
        return res.status(200).send(response)
    } catch (e) {
        next(e)
    }
}

const deleteQuestion = async (req, res, next)=> {
    const question = req.body
    try {
        const selectedQuestion = await Question.findByPk(question.id)
        await selectedQuestion.destroy()
        return res.status(200).send(question)
    } catch (e) {
        next(e)
    }
}

module.exports = {
    askQuestion,
    giveResponse,
    editQuestion,
    getAllQuestions,
    deleteQuestion
}