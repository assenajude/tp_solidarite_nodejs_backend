const db = require('../models/index');
const Payement = db.payement;
const Plan = db.plan

addPayement =  async (req, res, next) => {
    try {
        const payement = await Payement.create({
            mode: req.body.mode
        });
        return res.status(201).send(payement)
    } catch (e) {
        next(e.message)
    }
}

getAllPayement = async (req, res, next) => {
    try {
        const payements = await Payement.findAll({
            include: Plan
        });
        return res.status(200).send(payements)

    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    addPayement,
    getAllPayement
}
