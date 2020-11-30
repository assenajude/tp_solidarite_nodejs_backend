require('dotenv').config()

module.exports = {
    development: {
        host: process.env.DB_HOST,
        username:process.env.DB_USER,
        password:process.env.DB_PASS,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
            decimalNumbers: true
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
}
