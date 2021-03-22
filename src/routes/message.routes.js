const express = require('express')
const router = express.Router()
const messageCtrl = require('../controllers/message.controller')

router.get('/', messageCtrl.getUserMessage)
router.post('/', messageCtrl.sendMessageToToutPromo)
router.post('/response', messageCtrl.respondeToMsg)
router.patch('/response', messageCtrl.updateResponse)
router.delete('/response', messageCtrl.deleteMsgResponse)
router.patch('/update', messageCtrl.getUserMessageRead)
router.delete('/delete', messageCtrl.deleteMessage)
router.post('/parrainageMessage', messageCtrl.sendParrainageMessage)

module.exports = router