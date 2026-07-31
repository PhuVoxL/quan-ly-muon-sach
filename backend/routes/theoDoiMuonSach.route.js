const express = require('express');
const router = express.Router();
const theoDoiMuonSachController = require('../controllers/theoDoiMuonSach.controller');
const { verifyToken, verifyNhanVien } = require('../middlewares/auth.middleware');

// --- QUYỀN CỦA ĐỘC GIẢ ---
// Phải đăng nhập mới được xem lịch sử của mình (Lưu ý: Route /lich-su phải đặt trước /:id)
router.get('/lich-su', verifyToken, theoDoiMuonSachController.findLichSuCaNhan);
// Phải đăng nhập mới được gửi yêu cầu mượn sách (Tạo phiếu mới)
router.post('/', verifyToken, theoDoiMuonSachController.create);

// --- QUYỀN CỦA NHÂN VIÊN ---
// Chỉ nhân viên mới được xem toàn bộ danh sách phiếu mượn của hệ thống
router.get('/', verifyToken, verifyNhanVien, theoDoiMuonSachController.findAll);
// Chỉ nhân viên mới được duyệt, cập nhật trạng thái hoặc xóa phiếu
router.put('/gia-han/:id', verifyToken, theoDoiMuonSachController.yeuCauGiaHan);
router.put('/:id', verifyToken, verifyNhanVien, theoDoiMuonSachController.update);
router.delete('/:id', verifyToken, verifyNhanVien, theoDoiMuonSachController.delete);

module.exports = router;