const db = require('../../db/models/index');
const Payement = db.Payement;
const Plan = db.Plan;


createPlan = async (req, res, next) => {
    const idPayement = req.body.payementId;
    const newPlan = {
        libelle: req.body.libelle,
        descripPlan: req.body.description,
        nombreMensualite: req.body.mensualite,
        compensation: req.body.compensation,
    }
    const transaction = await db.sequelize.transaction()
    try {
        let payement = await Payement.findByPk(idPayement, {transaction});
        if (!payement) return res.status(404).send(`Le payement d'id ${idPayement} n'a pas été trouvé`)

        const  plan = await payement.createPlan(newPlan, {transaction});
        await transaction.commit()
        return res.status(201).send(plan);
    } catch (e) {
        await transaction.rollback()
        next(e.message)
    }
};

getAllPlan = async (req, res, next) => {
    try {
        const plans = await Plan.findAll({
            include: [Payement]
        });
        if (!plans) return res.status(404).send('Aucun plan trouvé')
        return res.status(200).send(plans);
    } catch (e) {
        next(e.message)
    }

}


module.exports = {
    createPlan,
    getAllPlan
}