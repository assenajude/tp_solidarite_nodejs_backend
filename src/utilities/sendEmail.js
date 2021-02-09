require('dotenv').config()
const sgMail = require('@sendgrid/mail')
const logger = require('../startup/logger')


sgMail.setApiKey(process.env.SEND_EMAIL_KEY)

const orderSuccessMail = (user, items,frais, interet, montant) => {
    sgMail.send({
       // to: user.email,
        from: 'toutpromo0@gmail.com',
        template_id: 'd-f7f672af744c4d7a96925e35141f72e8',
        personalizations: [
            {
                to: [
                    {
                        email: user.email
                    }
                ],
                dynamic_template_data: {
                    username: user.username,
                    cartItems:items,
                    fraisTransport: frais,
                    interet: interet,
                    total: montant
                }
            }
        ]
    }).catch(err => logger.error(err))

}


module.exports = {
    orderSuccessMail
}
