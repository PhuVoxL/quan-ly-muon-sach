const express = require('express');
const router = express.Router();
const danhGiaController = require('../controllers/danhGia.controller');
// Nhúng "bảo vệ" vào
const authMiddleware = require('../middlewares/auth.middleware');

// GET: Ai cũng có thể xem đánh giá (Không cần middleware)
router.get('/:sachId', danhGiaController.findBySach);

// POST: Chỉ người đã đăng nhập (có token) mới được viết đánh giá
router.post('/', authMiddleware.verifyToken, danhGiaController.create);

module.exports = router;