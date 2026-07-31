const express = require('express');
const router = express.Router();
// Gọi người phục vụ (Controller) vừa viết ở trên vào đây
const nhaXuatBanController = require('../controllers/nhaXuatBan.controller');

// Khi có yêu cầu GET (Lấy dữ liệu) tới thư mục gốc của NXB -> Gọi hàm findAll
router.get('/', nhaXuatBanController.findAll);

// Khi có yêu cầu POST (Gửi dữ liệu lên) tới thư mục gốc của NXB -> Gọi hàm create
router.post('/', nhaXuatBanController.create);

module.exports = router;