const db = require('../models/index')
const Article = db.article;
const ShoppingCart = db.shoppingCart
const CartItem = db.cartItem;
const User = db.user

const addItemToCart = async (req, res, next) => {
    try {
        let shoppingCart;
        const user = await User.findByPk(req.body.userId)
        const article = await Article.findByPk(req.body.articleId)
        shoppingCart = await user.getShoppingCart()
        if (!shoppingCart) {
            shoppingCart = await User.createShoppingCart({
                cartLength:0,
                cartAmount: 0
            })
        }

        const cartItems = await shoppingCart.getCartItems()
        const newItem = {
            id: article.id,
            libelle: article.designArticle,
            image: article.imageArticle,
            quantite: 1,
            montant: article.prixPromo

        }
        const checkItem = cartItems.find(item => item.id === newItem.id)
        if(checkItem) {
            checkItem.quantite ++;
            checkItem.montant += article.prixPromo
        } else {
            await article.setShoppingCart({
                through: {newItem}
            })
        }
        res.status(200).send(shoppingCart)
     } catch (e) {
        next(e.message)
    }
}


module.exports = {
    addItemToCart
}