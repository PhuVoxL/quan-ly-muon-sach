const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sach.controller');

// Import 2 người bảo vệ
const { verifyToken, verifyNhanVien } = require('../middlewares/auth.middleware');

// GET: Ai cũng có thể xem danh sách sách (Không cần bảo vệ)
router.get('/', sachController.findAll);

// POST, PUT, DELETE: Bắt buộc phải có token (đã đăng nhập) VÀ phải là nhân viên
router.post('/', verifyToken, verifyNhanVien, sachController.create);
router.put('/:id', verifyToken, verifyNhanVien, sachController.update);
router.delete('/:id', verifyToken, verifyNhanVien, sachController.delete);

module.exports = router;