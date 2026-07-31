const express = require('express');
const router = express.Router();
// Gọi người phục vụ (Controller) vừa viết ở trên vào đây
const nhaXuatBanController = require('../controllers/nhaXuatBan.controller');

// Khi có yêu cầu GET (Lấy dữ liệu) tới thư mục gốc của NXB -> Gọi hàm findAll
router.get('/', nhaXuatBanController.findAll);

// Khi có yêu cầu POST (Gửi dữ liệu lên) tới thư mục gốc của NXB -> Gọi hàm create
router.post('/', nhaXuatBanController.create);

// Phương thức DELETE, :id là một tham số động đại diện cho mã ObjectId của MongoDB
router.delete('/:id', nhaXuatBanController.delete);

// Phương thức PUT dùng để cập nhật toàn bộ thông tin của một đối tượng
router.put('/:id', nhaXuatBanController.update);

module.exports = router;