let Queue = require('bull')
const db = require('../../db/models/index');
const Payement = db.Payement;
const Plan = db.Plan;
const {planQueue} = require('../workers/queues')
const logger = require('../startup/logger')

let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workQueue = new Queue('work', REDIS_URL)


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
         /*await workQueue.add('addPayement',data, {
              removeOnComplete: true,
              removeOnFail: true,
              attempts: 1,
          })*/
            let payement = await Payement.findByPk(idPayement);
            if (!payement) return res.status(404).send(`Le payement d'id ${idPayement} n'a pas été trouvé`)
            const newPlan = await payement.createPlan(data)
  /*      workQueue.on('failed', (error) => {
            logger.error(error)
        })

        workQueue.on('completed', (job, result) => {
            return res.status(201).send(result)
        })*/
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