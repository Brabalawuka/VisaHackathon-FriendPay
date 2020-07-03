import models, {connectDb} from './models';
const express = require('express');
const app = express();

// Middlewares
const cors = require("cors");
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Config
const config = require('./config/config.json');
const defaultConfig = config.production;
const port = defaultConfig.node_port;

// Routing
const indexRouter = require('./routes/index');
app.use('/', indexRouter);
const databaseRouter = require('./routes/database');
app.use('/database', databaseRouter);
const notificationRouter = require('./routes/notification');
app.use('/notification', notificationRouter);
const gatewayRouter = require('./routes/gateway');
app.use('/gateway', gatewayRouter);

// Toggle to start app with clean database
const eraseDbOnConnect = false;

// Connect to DB before starting express app
connectDb().then(async() => {
    if (eraseDbOnConnect) {
        await Promise.all([
            models.Transaction.deleteMany({}),
        ])
    }

    app.listen(port, () => {
        console.log(`App running on port ${port}!`);
    });
});

module.exports = app;

