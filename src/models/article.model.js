module.exports = (sequelize, Sequelize) => {
    const Article = sequelize.define('articles', {
        codeArticle: {
            type: Sequelize.STRING,
            max: 20
        },
        designArticle: {
            type: Sequelize.STRING,
            max: 50
        },
        descripArticle: {
            type: Sequelize.STRING,
            max: 255
        },
        qteStock: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        prixReel: {
            type: Sequelize.INTEGER,
            defaultValue: 5
        },
        prixPromo: {
            type: Sequelize.INTEGER,
            defaultValue: 5
        },
        imageArticle: Sequelize.STRING,
        aide: Sequelize.BOOLEAN
    });
    return Article;
}