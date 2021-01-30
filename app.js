require('dotenv').config()
const errorHandler = require('./src/middlewares/error.handler')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const logger = require('./src/startup/logger')
const express = require('express');
const {transports} = require('winston')


const app = express();



if(!process.env.JWT_KEY) {
    console.error('FATAL ERROR, la clef privée jwt nexiste pas')
    process.exit(1)
}


logger.exceptions.handle(
    new transports.File({filename: 'exceptions.log'})
)

logger.rejections.handle(
    new transports.File({filename: 'exceptions.log'})
)




const corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next)=> {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});



app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));
app.use(express.static(path.join(__dirname, 'public')))

const db = require('./db/models/index');
const initialiseRole = require('./src/startup/initRoleFunction')
db.sequelize.sync().then(() => {
    logger.info('the app has been successfully connected to the database');
    // initialiseRole()
}).catch(error => {
    logger.error(error.message)});



require('./src/startup/routes')(app);

app.use(errorHandler)


module.exports = app;
