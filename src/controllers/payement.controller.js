const db = require('../../db/models/index');
const Payement = db.Payement;
const Plan = db.Plan

addPayement =  async (req, res, next) => {
    try {
        let payement;
        if(req.body.payementId) {
            payement = await Payement.findByPk(req.body.payementId)
            if(!payement)return res.status(404).send({message: "Payement non trouvé"})
            await payement.update({
                mode: req.body.mode
            })
        }else {
            payement = await Payement.create({
                mode: req.body.mode
            });
        }
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

const deletePayement = async (req, res, next) => {
    try {
        const selectedPayement = await Payement.findByPk(req.body.payementId)
        if(!selectedPayement)return res.status(404).send({message: "payement non trouvé"})
        const payementPlans = await selectedPayement.getPlans()
        if(payementPlans && payementPlans.length>0) {
            return res.status(401).send({message: "Vous ne pouvez pas supprimer ce payement contenant des plans."})
        }
        await selectedPayement.destroy()
        return res.status(200).send({payementId: selectedPayement.id})
    } catch (e) {
        next(e)
    }
}

module.exports = {
    addPayement,
    getAllPayement,
    deletePayement
}
