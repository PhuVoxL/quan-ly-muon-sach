const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sach.controller');

router.get('/', sachController.findAll);
router.post('/', sachController.create);

router.put('/:id', sachController.update);
router.delete('/:id', sachController.delete);

module.exports = router;