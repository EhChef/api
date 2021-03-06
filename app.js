const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eh_chef', { useNewUrlParser: true });
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const orderRoutes = require('./api/routes/orders');
const tableRoutes = require('./api/routes/tables');
const menuRoutes = require('./api/routes/menus');
const starterRoutes = require('./api/routes/starters');
const mainCoursesRoutes = require('./api/routes/mainCourses');
const dessertRoutes = require('./api/routes/desserts');
const extraRoutes = require('./api/routes/extras');
const accountRoutes = require('./api/routes/accounts');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Account'
    );
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
})

app.use('/orders', orderRoutes);
app.use('/tables', tableRoutes);
app.use('/menus', menuRoutes);
app.use('/starters', starterRoutes);
app.use('/maincourses', mainCoursesRoutes);
app.use('/desserts', dessertRoutes);
app.use('/extras', extraRoutes);
app.use('/accounts', accountRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
