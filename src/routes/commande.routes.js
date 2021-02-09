const express = require('express')
const router = express.Router()
const orderCtrl = require('../controllers/commande.controller')
const token = require('../middlewares/auth.jwt')

router.post('/', token.verifyToken, orderCtrl.saveOrder)
router.post('/contrats', orderCtrl.createOrderContrat)
router.patch('/contrats/update', orderCtrl.updateOrderContrat)
router.get('/byUser',token.verifyToken, orderCtrl.getOrdersByUser)
router.patch('/update', orderCtrl.updateOrder)
router.delete('/delete',token.verifyToken, orderCtrl.deleteOrder)

module.exports = router