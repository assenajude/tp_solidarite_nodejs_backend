const dayjs = require('dayjs')
const accordMessage = (accord,receiver, dateCmde) => {
    let message = ''
    let msgHeader = ''
    const dateFormated = dayjs(dateCmde).format('DD/MM/YYYY HH:mm:ss')
    if(accord.toLowerCase() === 'accepté') {
        msgHeader = 'Félicitation! Votre demande a été acceptée'
        message = `Bonjour, ${receiver} votre demande faite le ${dateFormated} a été accordée, vous pouvez voir la reference pour plus de details ou nous contacter pour plus d'informations. Merci d'avoir utilisé Tout-Promo pour votre demande.`
    } else {
        msgHeader = "Desolé! Votre demande n'a pas été acceptée"
        message = `Bonjour, ${receiver} votre demande faite le ${dateFormated} n'a pas été, vous pouvez voir la reference pour plus de details ou nous contacter pour plus d'informations. Merci d'avoir utilisé Tout-Promo pour votre  demande.`
    }
    return {msgHeader, message}
}

const livraisonMessage = (libelle, receiver, numCmde) => {
    let message = ''
    let msgHeader = ''
    if(libelle.toLowerCase() ==='livré') {
        msgHeader = `Commande ${numCmde} livrée`
        message = `Bonjour ${receiver.nom} ${receiver.prenom}, votre commande numero ${numCmde} a été livrée.`
    } else {
        msgHeader = `Commande ${numCmde} livrée partièlement`
        message = `Bonjour ${receiver.nom} ${receiver.prenom}, votre commande numero ${numCmde} a été livrée partièlement.`
    }
    return {msgHeader, message}
}

const expiredMessage = (receiver, numOrder) => {
    const msgHeader = `Votre commande ${numOrder} a expiée.`
    const message = `Bonjour ${receiver.nom} ${receiver.prenom}, Votre commande ${numOrder} a expirée. Si vous êtes toujours interessé par cette commande vous devez refaire la commande.`
    return {msgHeader, message}
}

const expireInMessage = (receiver, numOrder, expireIn) =>  {
    const msghHeader = `Votre commande ${numOrder} expire dans ${expireIn}`
    const message = `Bonjour ${receiver.nom} ${receiver.prenom}, votre commande ${numOrder} expire dans ${expireIn}. Si vous êtes toujours interessé par cette commande, vous devez la faire passer en contrat.`
return {msghHeader, message}
}

module.exports = {
    accordMessage,
    livraisonMessage,
    expiredMessage,
    expireInMessage
}