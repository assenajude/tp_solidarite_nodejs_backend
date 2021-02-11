require('dotenv').config()
const fs = require('fs')

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
    },
    production: {
        use_env_variable: DATABASE_URL,
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOSTNAME,
        port: process.env.PROD_DB_PORT,
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
            bigNumberStrings: true,
            ssl: {
                "rejectUnauthorized": false
            }
        }
    }
}
