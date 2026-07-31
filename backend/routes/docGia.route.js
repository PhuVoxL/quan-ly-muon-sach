const express = require('express');
const router = express.Router();
const docGiaController = require('../controllers/docGia.controller');

const { verifyToken, verifyNhanVien } = require('../middlewares/auth.middleware');

// GET: Ai cũng có thể xem danh sách sách (Không cần bảo vệ)
router.get('/', docGiaController.findAll);

// POST, PUT, DELETE: Bắt buộc phải có token (đã đăng nhập) VÀ phải là nhân viên
router.post('/', verifyToken, verifyNhanVien, docGiaController.create);
router.put('/:id', verifyToken, verifyNhanVien, docGiaController.update);
router.delete('/:id', verifyToken, verifyNhanVien, docGiaController.delete);


module.exports = router;