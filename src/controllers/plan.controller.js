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
        let newPlan;
        if(req.body.planId) {
            newPlan = await Plan.findByPk(req.body.planId)
            if(!newPlan)return res.status(404).send({message: "Plan non trouvé"})
            await newPlan.update(data)
        }else {
            newPlan = await payement.createPlan(data)
        }
        const justAdded = await Plan.findByPk(newPlan.id, {
            include: Payement
        })
        return res.status(201).send(justAdded)
    } catch (e) {
        next(e)
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
        next(e)
    }

}

const deletePlan = async (req, res, next) => {
    try{
        const selectedPlan = await Plan.findByPk(req.body.planId)
        if(!selectedPlan) return res.status(404).send({message: "Plan non trouvé"})
        await selectedPlan.destroy()
        return res.status(200).send({planId: req.body.planId})
    } catch (e) {
        next(e)
    }
}


module.exports = {
    createPlan,
    getAllPlan,
    deletePlan
}