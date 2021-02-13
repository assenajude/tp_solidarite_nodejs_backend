require('dotenv').config()
module.exports = {
    development: {
        host: process.env.DB_HOST,
        username:'postgres',
        password:'kouakou01',
        database: 'solidaritedb',
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
        use_env_variable: "DATABASE_URL",
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOSTNAME,
        port: process.env.PROD_DB_PORT,
        dialect: "postgres",
        dialectOptions: {
            bigNumberStrings: true,
            ssl: {
                "rejectUnauthorized": false
            }
        }
    }
}
