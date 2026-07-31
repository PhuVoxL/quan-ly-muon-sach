const mongoose = require('mongoose');

// Khai báo cấu trúc (Schema) cho Nhà Xuất Bản
const nhaXuatBanSchema = new mongoose.Schema({
    maNXB: { 
        type: String, 
        required: true, 
        unique: true // Đảm bảo mã nhà xuất bản không bị trùng lặp
    },
    tenNXB: { 
        type: String, 
        required: true // Bắt buộc phải nhập tên
    },
    diaChi: { 
        type: String, 
        required: true 
    }
}, { 
    timestamps: true // Tự động ghi lại thời gian tạo và cập nhật dữ liệu
});

// Chuyển Schema thành Model và xuất ra để dùng ở các file khác
module.exports = mongoose.model('NhaXuatBan', nhaXuatBanSchema);