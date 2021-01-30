const db = require('../../db/models/index');
const Payement = db.Payement;
const Plan = db.Plan;


createPlan = async (req, res, next) => {
    const idPayement = req.body.payementId;

    let planImages = []
    if(req.files) {
        req.files.forEach(file => {
            const lienImage = `${req.protocol}://${req.get('host')}/images/${file.filename}`
            planImages.push(lienImage)
        })
    }
    try {

        let payement = await Payement.findByPk(idPayement);
        if (!payement) return res.status(404).send(`Le payement d'id ${idPayement} n'a pas été trouvé`)
        const  plan = await payement.createPlan({
            libelle: req.body.libelle,
            descripPlan: req.body.description,
            nombreMensualite: req.body.mensualite,
            compensation: req.body.compensation,
            imagesPlan: planImages
        });
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