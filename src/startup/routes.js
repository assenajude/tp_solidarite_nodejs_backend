const authRoute = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');
const espaceRoutes = require('../routes/espace.routes')
const categorieRoutes = require('../routes/categorie.routes');
const articleRoutes = require('../routes/article.routes');
const locationRoutes = require('../routes/location.routes');
const payementRoutes = require('../routes/payement.routes');
const planRoutes = require('../routes/plan.routes');
const pointRoutes = require('../routes/pointRelais.routes');
const userAdresseRoutes = require('../routes/userAdresse.routes')
const regionRoutes  = require('../routes/region.routes');
const villeRoutes = require('../routes/ville.routes')
const orderRoutes = require('../routes/commande.routes')
const factureRoutes = require('../routes/facture.routes')
const trancheRoutes  = require('../routes/tranche.routes')
const serviceRoutes = require('../routes/service.routes')
const mainRoutes = require('../routes/main.routes')
const contratRoutes = require('../routes/contrat.routes')
const shoppingCartRoutes = require('../routes/shoppingCart.routes')
const optionRoutes = require('../routes/option.routes')
const propositionRoutes  = require('../routes/proposition.route')
const faqRoutes = require('../routes/faq.routes')
const s3Routes = require('../routes/s3_upload.routes')
const compteParrainRoutes = require('../routes/compteParrainage.routes')

module.exports = function routes(app) {
    app.use('/api/auth', authRoute);
    app.use('/api/users', userRoutes);
    app.use('/api/espaces', espaceRoutes)
    app.use('/api/categories', categorieRoutes);
    app.use('/api/articles', articleRoutes);
    app.use('/api/locations',locationRoutes);
    app.use('/api/payements', payementRoutes);
    app.use('/api/plans', planRoutes);
    app.use('/api/pointRelais', pointRoutes);
    app.use('/api/userAdresses', userAdresseRoutes);
    app.use('/api/regions', regionRoutes);
    app.use('/api/villes', villeRoutes)
    app.use('/api/commandes', orderRoutes)
    app.use('/api/factures', factureRoutes)
    app.use('/api/tranches', trancheRoutes)
    app.use('/api/services', serviceRoutes)
    app.use('/api/mainDatas', mainRoutes)
    app.use('/api/contrats', contratRoutes)
    app.use('/api/shoppingCarts', shoppingCartRoutes)
    app.use('/api/options', optionRoutes)
    app.use('/api/propositions', propositionRoutes)
    app.use('/api/faq', faqRoutes)
    app.use('/api/uploadFile', s3Routes)
    app.use('/api/compteParrainages', compteParrainRoutes)
}