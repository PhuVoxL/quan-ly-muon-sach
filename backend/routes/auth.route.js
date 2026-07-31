const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Khai báo 3 cánh cửa API tương ứng
router.post('/register', authController.register);
router.post('/login-docgia', authController.loginDocGia);
router.post('/login-nhanvien', authController.loginNhanVien);

module.exports = router;