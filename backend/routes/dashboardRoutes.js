const express = require('express')
const dashboardRouter = express.Router();

const dashboardController = require('../controllers/dashboardController')

// MIddle Ware
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');


dashboardRouter.get('/', auth, isAdmin, dashboardController);

module.exports = dashboardRouter;

