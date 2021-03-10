const db = require('../../db/models/index');
const Payement = db.Payement;
const Plan = db.Plan;

createPlan = async (req, res, next) => {
    const idPayement = req.body.payementId;


    const data = {
        libelle: req.body.libelle,
        descripPlan: req.body.description,
        nombreMensualite: req.body.mensualite,
        compensation: req.body.compensation,
        imagesPlan: req.body.planImagesLinks
    }
    try {
            let payement = await Payement.findByPk(idPayement);
            if (!payement) return res.status(404).send(`Le payement d'id ${idPayement} n'a pas été trouvé`)
            const newPlan = await payement.createPlan(data)
  return res.status(201).send(newPlan)
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