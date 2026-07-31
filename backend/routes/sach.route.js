const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sach.controller');

router.get('/', sachController.findAll);
router.post('/', sachController.create);

module.exports = router;