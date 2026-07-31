const express = require('express');
const router = express.Router();
// Gọi người phục vụ (Controller) vừa viết ở trên vào đây
const nhaXuatBanController = require('../controllers/nhaXuatBan.controller');

const { verifyToken, verifyNhanVien } = require('../middlewares/auth.middleware');

// GET: Ai cũng có thể xem danh sách sách (Không cần bảo vệ)
router.get('/', nhaXuatBanController.findAll);

// POST, PUT, DELETE: Bắt buộc phải có token (đã đăng nhập) VÀ phải là nhân viên
router.post('/', verifyToken, verifyNhanVien, nhaXuatBanController.create);
router.put('/:id', verifyToken, verifyNhanVien, nhaXuatBanController.update);
router.delete('/:id', verifyToken, verifyNhanVien, nhaXuatBanController.delete);

module.exports = router;