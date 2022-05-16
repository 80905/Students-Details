const express = require('express');
const viewsController = require('../controllers/viewsController');
const router = express.Router();

router.get('/', viewsController.getHomePage);

router.get('/students', viewsController.getAllStudents);

router.get('/about', viewsController.getAbout);

module.exports = router;
