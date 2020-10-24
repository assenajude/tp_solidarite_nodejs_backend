module.exports = (sequelize, Sequelize) => {
    const Contrat = sequelize.define('contrat',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dateDebut: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        dateFin: Sequelize.DATE,
        dateCloture: Sequelize.DATE,
        clause: Sequelize.STRING,
        montant: Sequelize.FLOAT,
        mensualite: Sequelize.INTEGER,
        status: {
            type: Sequelize.STRING,
            max: 50,
            defaultValue: 'en cours'
        }
    })
    return Contrat
}