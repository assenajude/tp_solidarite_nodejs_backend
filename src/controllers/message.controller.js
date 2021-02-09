const db = require('../../db/models')
const Op = db.Sequelize.Op
const Message = db.Message
const MsgResponse = db.MsgResponse
const User = db.User
const decoder = require('jwt-decode')


const getUserMessage = async(req, res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    try {
        const connectedUser = await User.findByPk(user.id)
        const userMessages = await Message.findAll({
            where: {
              [Op.or]:[{receiverId: connectedUser.id}, {senderId: connectedUser.id}]
            },
            include: MsgResponse
        })
        return res.status(200).send(userMessages)
    } catch (e) {
        next(e.message)
    }
}

const getUserMessageRead = async (req, res, next) => {
    try{
        let selectedMessage = await Message.findByPk(req.body.messageId)
        if(req.body.isRead) {
            selectedMessage.isRead = req.body.isRead
        }else {
            selectedMessage.msgHeader = req.body.title
            selectedMessage.content = req.body.message
        }
        await selectedMessage.save()
        return res.status(200).send(selectedMessage)
    } catch (e) {
        next(e.message)
    }
}

const sendMessageToToutPromo = async (req,res, next) => {
    try{
        const sender = await User.findByPk(req.body.userId)
        const receiver = await User.findByPk(1)
        let sentMessage = await Message.create({
            msgHeader: req.body.title,
            content: req.body.message,
            isRead: true
        })
        await sentMessage.setSender(sender)
        await sentMessage.setReceiver(receiver)
        const justCreated = await Message.findByPk(sentMessage.id, {
            include: MsgResponse
        })
        return res.status(200).send(justCreated)
    } catch (e) {
        next(e.message)
    }
}

const respondeToMsg = async (req, res, next)=> {
    try{
        let selectedMsg = await Message.findByPk(req.body.messageId)
        const newResponse = await selectedMsg.createMsgResponse({
            respHeader: req.body.title,
            respContent: req.body.reponse
        })

        return res.status(200).send(newResponse)
    } catch (e) {
        next(e.message)
    }
}


const updateResponse = async (req, res, next) => {
    try{
        const selectedResponse = await MsgResponse.findByPk(req.body.id)
        const newUpated = await selectedResponse.update({
            isRead: req.body.isRead
        })
        return res.status(200).send(newUpated)
    } catch (e) {
        next(e.message)
    }
}

const deleteMessage = async (req, res, next) => {
    const selectedMessage = req.body
    try {
        const message = await Message.findByPk(selectedMessage.id)
        await message.destroy()
        return res.status(200).send(selectedMessage)
    } catch (e) {
        next(e.message)
    }
}

const deleteMsgResponse = async (req, res, next) => {
    const response = req.body
    try {
        const selectedResp = await MsgResponse.findByPk(response.id)
        await selectedResp.destroy()
        return res.status(200).send(response)
    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    respondeToMsg,
    sendMessageToToutPromo,
    getUserMessageRead,
    getUserMessage,
    updateResponse,
    deleteMessage,
    deleteMsgResponse
}