const db = require('../models/index');
const Role = db.role;

function initRole() {
    Role.create({
        id:1,
        name: 'admin'
    });

    Role.create(
        {
            id:2,
            name: 'moderator'
        },

        Role.create({
            id:3,
            name: 'user'
        })
    )
};

module.exports = initRole;