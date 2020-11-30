require('dotenv').config()
const sgMail = require('@sendgrid/mail')


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
        /*dynamic_template_data: {
            username: user.username,
            cartItems:items,
            fraisTransport: frais,
            interet: interet,
            total: montant
        }*/
   /*     subject: `Félicitation!, ${user.username}`,
        html: `Votre commande a été passée avec succès, le numero est <strong> ${commande.numero}<strong>`*/
    }).catch(err => console.log(err))

}


module.exports = {
    orderSuccessMail
}
