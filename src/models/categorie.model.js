module.exports = (sequelize, Sequelize) => {
    const Categorie = sequelize.define('categories', {
        libelleCateg: {
            type: Sequelize.STRING,
            max: 50
        },
        descripCateg: {
            type: Sequelize.STRING,
            max: 255
        },
        typeCateg: {
            type: Sequelize.STRING,
            max: 50
        }
    });
    return Categorie;
}