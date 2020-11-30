const decoder = require('jwt-decode')
const db = require('../../db/models/index')
const User = db.User
const ShoppingCart = db.ShoppingCart
const CartItem = db.CartItem
const Location = db.Location
const Article = db.Article
const Service = db.Service

const addItemToCart = async (req, res, next) => {
    let cartItem;
    const token = req.headers ['x-access-token']
    const connectedUser = decoder(token)
    const item = req.body
    const typeCmde = item.typeCmde || item.Categorie.typeCateg
    if(typeCmde === 'e-location') {
            cartItem = {
                id: item.id,
                libelle: item.libelleLocation,
                image: item.imagesLocation[0],
                prix: item.prix || item.coutPromo,
                couleur: item.couleur || '',
                taille: item.taille || '',
                modele: item.modele || '',
                quantite: 1 ,
                caution: item.nombreCaution,
                montant: item.montant || +item.coutPromo * item.nombreCaution,
                type: typeCmde
            }

    } else if(typeCmde === 'e-service') {
            cartItem =  {
                id: item.id,
                libelle: item.libelle,
                image: item.imagesService[0],
                prix: 0,
                quantite: 1,
                montantMin: item.montantMin || 0,
                montantMax: item.montantMax || 0,
                montant: 0,
                type: typeCmde
            }
        } else {
        cartItem = {
            id: item.id,
            libelle: item.designArticle || item.designation ,
            image: item.imagesArticle[0],
            prix: item.prixPromo || item.prix,
            quantite: item.quantite || 1,
            montant: +item.montant || item.prixPromo  ,
            couleur: item.couleur || '',
            taille: item.taille || '',
            type: typeCmde || item.Categorie.typeCateg,
        }
    }
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

          if(typeCmde === 'e-commerce') {
              const cartItems = await CartItem.findAll({
                shoppingCartId: shoppingCart.id,
            })
              let itemIndex = cartItems.findIndex(item => item.libelle === cartItem.libelle && item.couleur === cartItem.couleur && item.taille === cartItem.taille)
             if(itemIndex >=0) {
                 const selectedItem = cartItems[itemIndex]
                 let currentItem = await CartItem.findByPk(selectedItem.id)
                 currentItem.quantite+=cartItem.quantite
                 currentItem.montant+=cartItem.montant
                 await currentItem.save()
                shoppingCart.cartAmount+=cartItem.montant
                shoppingCart.cartLength+=cartItem.quantite
                 cartItem = currentItem
             } else {
                 const selectedArticle = await Article.findByPk(item.id)
                  await shoppingCart.addArticle(selectedArticle, {
                    through: {
                    libelle: cartItem.libelle,
                    image: cartItem.image,
                    prix: cartItem.prix,
                    quantite: cartItem.quantite,
                    montant: cartItem.montant,
                    couleur: cartItem.couleur,
                    taille: cartItem.taille,
                    typeCmde: cartItem.type
                }
            })
                shoppingCart.cartLength+=cartItem.quantite
                shoppingCart.cartAmount+=cartItem.montant
                 const cartItems = await shoppingCart.getArticles()
                 cartItem = cartItems.pop().CartItem
             }
        } else if(typeCmde === 'e-location') {
              console.log(cartItem)
              const selectedLocation = await Location.findByPk(item.id)
              await shoppingCart.addLocation(selectedLocation, {
                through: {
                    libelle: cartItem.libelle,
                    image: cartItem.image,
                    prix: cartItem.prix,
                    quantite: 1,
                    montant: cartItem.montant,
                    couleur: cartItem.couleur,
                    taille: cartItem.taille,
                    typeCmde: cartItem.type
                }
            })
            shoppingCart.cartLength = 1
            shoppingCart.cartAmount = cartItem.montant

        } else {
              const selectedService = await Service.findByPk(item.id)
              await shoppingCart.addService(selectedService, {
                  through: {
                      libelle: cartItem.libelle,
                      image: cartItem.image,
                      prix: cartItem.prix,
                      quantite: 1,
                      montant: cartItem.montant,
                      montantMin: cartItem.montantMin,
                      montantMax: cartItem.montantMax,
                      typeCmde: cartItem.type
                  }
              })
              const cartItems = await shoppingCart.getServices()
              cartItem = cartItems.pop().CartItem
              shoppingCart.cartLength = 1
              shoppingCart.cartAmount = cartItem.montant
          }
        await shoppingCart.save()
        return res.status(201).send(cartItem)
    }
     catch (e) {
         next(e)

    }
}

incrementItemQuantity = async (req, res, next) => {
    const item = req.body.item
    try {
        let selectedItem = await CartItem.findByPk(item.id)
        selectedItem.quantite+=1
        selectedItem.montant+=item.prix
        await selectedItem.save()

        let shoppingCart = await ShoppingCart.findByPk(item.shoppingCartId)
        shoppingCart.cartLength+=1
        shoppingCart.cartAmount+=selectedItem.prix
        return res.status(200).send(item)
    } catch (e) {
        next(e.message)
    }
}

decrementItemQuantity = async (req, res, next) => {
    const item = req.body.item
    try {
        let selectedItem = await CartItem.findByPk(item.id)
        selectedItem.quantite-=1
        selectedItem.montant-=item.prix
        const newItem = await selectedItem.save()

        let shoppingCart = await ShoppingCart.findByPk(item.shoppingCartId)
        shoppingCart.cartLength-=1
        shoppingCart.cartAmount-=selectedItem.prix
        return res.status(200).send(item)
    } catch (e) {
        next(e.message)
    }
}

updateItem = async (req, res, next) => {
    const item = req.body
    try {
        let selectedItem = await CartItem.findByPk(item.id)
        selectedItem.prix = item.montant
        selectedItem.montant = item.montant
        await selectedItem.save()
        return res.status(200).send(item)
    } catch (e) {
        next(e.message)
    }

}

removeItem = async (req, res, next) => {
    const item = req.body
    try {
        let shoppingCart = await ShoppingCart.findByPk(item.shoppingCartId)
        if(item.typeCmde === 'e-commerce') {
            const selectedArticle = await Article.findByPk(item.articleId)
            await shoppingCart.removeArticle(selectedArticle)
        } else if(item.typeCmde ==='e-location') {
            const selectedLocation = await Location.findByPk(item.locationId)
            await shoppingCart.removeLocation(selectedLocation)
        } else {
            const selectedService = await Service.findByPk(item.serviceId)
            await shoppingCart.removeService(selectedService)
        }
        shoppingCart.quantite -= item.quantite
        shoppingCart.montant -= item.montant
        await shoppingCart.save()
        return res.status(200).send(item)
    } catch (e) {
        next(e.message)
    }
}

getCartItems = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const connectedUser = decoder(token)
    try {
        const userShoppingCart = await ShoppingCart.findOne({
            UserId: connectedUser.id
        })
        const cartArticles = await userShoppingCart.getArticles()
        const cartLocations = await userShoppingCart.getLocations()
        const cartServices = await userShoppingCart.getServices()
        const allData = [...cartArticles, ...cartServices, ...cartLocations]
        return res.status(200).send(allData)
    }catch (e) {
        next(e.message)
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