const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVien.controller');

router.get('/', nhanVienController.findAll);
router.post('/', nhanVienController.create);

module.exports = router;