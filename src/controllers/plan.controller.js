const db = require('../models/index');
const Payement = db.payement;
const Plan = db.plan;


createPlan = async (req, res, next) => {
    const idPayement = req.body.payementId;
    const newPlan = {
        libelle: req.body.libelle,
        descripPlan: req.body.description,
        nombreMensualite: req.body.mensualite,
        compensation: req.body.compensation,
    }
    try {
        const payement = await Payement.findByPk(idPayement);
        if (!payement) return res.status(404).send(`Le payement d'id ${idPayement} n'a pas été trouvé`)
        const plan = await payement.createPlan(newPlan);
        return res.status(201).send(plan);
    } catch (e) {
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