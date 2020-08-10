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
        prixArticle: {
            type: Sequelize.INTEGER,
            defaultValue: 5
        },
        imageArticle: Sequelize.STRING,
        aideVente: Sequelize.STRING
    });
    return Article;
}