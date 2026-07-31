const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVien.controller');

const { verifyToken, verifyNhanVien } = require('../middlewares/auth.middleware');

// GET: Ai cũng có thể xem danh sách sách (Không cần bảo vệ)
router.get('/', nhanVienController.findAll);

// POST, PUT, DELETE: Bắt buộc phải có token (đã đăng nhập) VÀ phải là nhân viên
router.post('/', verifyToken, verifyNhanVien, nhanVienController.create);
router.put('/:id', verifyToken, verifyNhanVien, nhanVienController.update);
router.delete('/:id', verifyToken, verifyNhanVien, nhanVienController.delete);


module.exports = router;