const express = require('express')
const router = express.Router()
const shoppingCartCtrl = require('../controllers/shopping.controller')

router.post('/addToCart', shoppingCartCtrl.addItemToCart)
router.patch('/updateItem', shoppingCartCtrl.updateItem)
router.patch('/incrementQuantity', shoppingCartCtrl.incrementItemQuantity)
router.patch('/decrementQuantity', shoppingCartCtrl.decrementItemQuantity)
router.get('/cartItems', shoppingCartCtrl.getCartItems)
router.delete('/deleteItem', shoppingCartCtrl.removeItem)

module.exports = router