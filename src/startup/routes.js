const authRoute = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');
const categorieRoutes = require('../routes/categorie.routes');
const articleRoutes = require('../routes/article.routes');
const locationRoutes = require('../routes/location.routes');
const payementRoutes = require('../routes/payement.routes');
const planRoutes = require('../routes/plan.routes');

module.exports = function routes(app) {
    app.use('/api/auth', authRoute);
    app.use('/api/access', userRoutes);
    app.use('/api/categories', categorieRoutes);
    app.use('/api/articles', articleRoutes);
    app.use('/api/locations',locationRoutes);
    app.use('/api/payements', payementRoutes);
    app.use('/api/plans', planRoutes)

}