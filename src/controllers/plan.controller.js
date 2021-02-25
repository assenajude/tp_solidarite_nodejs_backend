const db = require('../../db/models/index');
const Payement = db.Payement;
const Plan = db.Plan;
const {planQueue} = require('../workers/queues')
const logger = require('../startup/logger')

createPlan = async (req, res, next) => {
    const idPayement = req.body.payementId;

    let planImages = []
            if(req.files) {
                req.files.forEach(file => {
                    const lienImage = `${req.protocol}://${req.get('host')}/images/${file.filename}`
                    planImages.push(lienImage)
                })
            }

    const data = {
        libelle: req.body.libelle,
        descripPlan: req.body.description,
        nombreMensualite: req.body.mensualite,
        compensation: req.body.compensation,
        imagesPlan: planImages
    }
    try {
         await planQueue.add('addPayement',data, {
              removeOnComplete: true,
              removeOnFail: true,
              attempts: 1,
          })
            let payement = await Payement.findByPk(idPayement);
            if (!payement) return res.status(404).send(`Le payement d'id ${idPayement} n'a pas été trouvé`)
            planQueue.process('addPayement',async (job) =>  {
             const newPlan = await payement.createPlan(job.data)
                return newPlan
        })
        planQueue.on('failed', (error) => {
            logger.error(error)
        })

        planQueue.on('completed', (job, result) => {
            return res.status(201).send(result)
        })
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