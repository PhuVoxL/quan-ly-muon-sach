const express = require('express');
const router = express.Router();
const docGiaController = require('../controllers/docGia.controller');

router.get('/', docGiaController.findAll);
router.post('/', docGiaController.create);

router.put('/:id', docGiaController.update);
router.delete('/:id', docGiaController.delete);


module.exports = router;