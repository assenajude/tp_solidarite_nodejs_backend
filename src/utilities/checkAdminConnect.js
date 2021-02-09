
const isAdminConnected = (user) => {
    if (Object.entries(user).length > 0){
        const adminIndex = user.roles.indexOf('ROLE_ADMIN')
        if(adminIndex !== -1) {
            return true
        } else return false
    }
    return false
}

module.exports = isAdminConnected