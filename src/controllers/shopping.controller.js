const decoder = require('jwt-decode')
const db = require('../../db/models/index')
const User = db.User
const ShoppingCart = db.ShoppingCart
const CartItem = db.CartItem
const Location = db.Location
const Article = db.Article
const Service = db.Service
const Op = db.Sequelize.Op

const addItemToCart = async (req, res, next) => {
    let cartItem;
    const token = req.headers ['x-access-token']
    const connectedUser = decoder(token)
    const item = req.body
    const typeCmde = item.typeCmde || item.Categorie.typeCateg
    try {
        const user = await User.findByPk(connectedUser.id)
        let [shoppingCart, created] = await ShoppingCart.findOrCreate({
            where: {UserId: user.id},
            defaults: {
                cartLength:0,
                cartAmount: 0
            }
        })
        if(created) {
            await shoppingCart.setUser(user)
        }
        if (typeCmde === 'article') {
                const listArticles = await shoppingCart.getArticles()
            const allItems = []
            listArticles.forEach(item => {
                allItems.push(item.dataValues)
            })
            let itemIndex = allItems.findIndex(article => article.id === item.id)
            if(itemIndex >= 0) {
                    const selectedItem = allItems[itemIndex]
                let currentItem = await CartItem.findOne({
                        where: {
                            itemId: selectedItem.id
                        }
                    })
                   currentItem.quantite++
                    currentItem.montant += item.prixPromo
                    await currentItem.save()
                   shoppingCart.cartAmount+=item.prixPromo
                    shoppingCart.cartLength++
            } else {
                    const selectedArticle = await Article.findByPk(item.id)

                     await selectedArticle.addShoppingCart(shoppingCart, {
                        through: {
                            quantite: item.quantite || 1,
                            prix: item.prix || selectedArticle.prixPromo,
                            couleur: item.couleur || '',
                            taille: item.taille || '',
                            modele: item.modele || '',
                            montant: item.prix * item.quantite || selectedArticle.prixPromo * item.quantite || selectedArticle.prixPromo,
                        }
                    })
                   shoppingCart.cartLength+=item.quantite || 1
                    shoppingCart.cartAmount+= item.prix * item.quantite || selectedArticle.prixPromo * item.quantite || selectedArticle.prixPromo * 1
                }
             const updatedCartItems = await shoppingCart.getArticles()
             cartItem = updatedCartItems.find(article => article.id === item.id)

            }
        if(typeCmde === 'location') {
              let selectedLocation = await Location.findByPk(item.id)
            const caution = selectedLocation.nombreCaution
              await selectedLocation.addShoppingCart(shoppingCart, {
                through: {
                    quantite: 1,
                    prix: item.prix || selectedLocation.coutPromo,
                    couleur: item.couleur || '',
                    taille: item.taille || '',
                    modele: item.modele || '',
                    montant: item.prix || selectedLocation.coutPromo,
                }
            })
            shoppingCart.cartLength = 1
            shoppingCart.cartAmount = item.prix * caution || selectedLocation.coutPromo * 4
            const cartLocations = await shoppingCart.getLocations()
            cartItem = cartLocations[0]

        }
        if(typeCmde === 'service'){
              let selectedService = await Service.findByPk(item.id)
               await selectedService.addShoppingCart(shoppingCart, {
                  through: {
                      quantite: 1
                  }
              })
              shoppingCart.cartLength = 1
              shoppingCart.cartAmount = 0
            const contents = await shoppingCart.getServices()
            cartItem = contents[0]

          }
        await shoppingCart.save()
        return res.status(201).send(cartItem)
    }
     catch (e) {
         next(e)

    }
}

incrementItemQuantity = async (req, res, next) => {
    const item = req.body
    try {
        let selectedItem = await CartItem.findOne({
            where: {
                [Op.and]:[
                    {shoppingCartId: item.shoppingCartId},
                    {itemId: item.id}
                    ]
            }
        })
        selectedItem.quantite+=1
        selectedItem.montant+=item.prix
        await selectedItem.save()
        let shoppingCart = await ShoppingCart.findByPk(item.shoppingCartId)
        shoppingCart.cartLength+=1
        shoppingCart.cartAmount+=item.prix
        await shoppingCart.save()
        return res.status(200).send(item)
    } catch (e) {
        next(e)
    }
}

decrementItemQuantity = async (req, res, next) => {
    const item = req.body
    try {
        let selectedItem = await CartItem.findOne({
            where: {
                itemId: item.id,
                shoppingCartId: item.shoppingCartId
            }
        })
        selectedItem.quantite-=1
        selectedItem.montant-=item.prix
        await selectedItem.save()
        let shoppingCart = await ShoppingCart.findByPk(item.shoppingCartId)
        shoppingCart.cartLength-=1
        shoppingCart.cartAmount-=item.prix
        await shoppingCart.save()
        return res.status(200).send(item)
    } catch (e) {
        next(e)
    }
}

updateItem = async (req, res, next) => {
    const item = req.body
    try {
        let selectedItem = await CartItem.findOne({
            where: {
                itemId: item.id
            }
        })
        selectedItem.prix = item.montant
        selectedItem.montant = item.montant
        await selectedItem.save()
        let shoppingCart = await ShoppingCart.findByPk(item.shoppingCartId)
        shoppingCart.cartAmount = item.montant
        await shoppingCart.save()
        return res.status(200).send(item)
    } catch (e) {
        next(e)
    }

}

removeItem = async (req, res, next) => {
    const item = req.body
    try {
        let selectedItem = await CartItem.findOne({
            where: {
              itemId: item.id
            }
        })
        let shoppingCart = await ShoppingCart.findByPk(item.shoppingCartId)
            if(item.typeCmde === 'article') {
                    const selectedArticle = await Article.findByPk(item.id)
                if(selectedItem.quantite === 1) {
                    await selectedItem.destroy()
                    await shoppingCart.removeArticle(selectedArticle)
                } else {
                    selectedItem.quantite--
                    selectedItem.montant-=item.montant
                    shoppingCart.cartLength -= item.quantite
                    shoppingCart.cartAmount -= item.montant
                    await selectedItem.save()
                }

            } else {
                    await selectedItem.destroy()
                    shoppingCart.cartLength = 0
                    shoppingCart.cartAmount = 0
                if(item.typeCmde === 'location') {
                    const selectedLocation = await Location.findByPk(item.id)
                    await shoppingCart.removeLocation(selectedLocation)
                } else {
                    const selectedService = await Service.findByPk(item.id)
                    await shoppingCart.removeService(selectedService)
                }
            }
        await shoppingCart.save()
        return res.status(200).send(item)
    } catch (e) {
        next(e)
    }
}

getCartItems = async (req, res, next) => {
    try {
        let allDatas;
        const token = req.headers['x-access-token']
        if(token === 'null') {
            return res.status(200).send([])
        }
        const connectedUser = decoder(token)
        const userShoppingCart = await ShoppingCart.findOne({
            where: {
                UserId: connectedUser.id
            }
        })
        if(!userShoppingCart) return res.status(200).send([])
        const cartItems = await CartItem.findAll({
            where: {shoppingCartId:userShoppingCart.id}
        })
        if(cartItems.length === 0) {
            allDatas = []
        } else {
        const firstItemType = cartItems[0].itemType
        if(firstItemType === 'article') {
            allDatas = await userShoppingCart.getArticles()
        } else if(firstItemType === 'location') {
            allDatas = await userShoppingCart.getLocations()
        } else {
            allDatas = await userShoppingCart.getServices()
        }

        }
        return res.status(200).send(allDatas)
    }catch (e) {
        next(e)
    }
}


module.exports = {
    addItemToCart,
    updateItem,
    incrementItemQuantity,
    decrementItemQuantity,
    getCartItems,
    removeItem
}