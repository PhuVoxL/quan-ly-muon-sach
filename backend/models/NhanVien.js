const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
    msnv: { type: String, required: true, unique: true },
    hoTenNV: { type: String, required: true },
    password: { type: String, required: true }, // Mật khẩu lưu tạm ở dạng chuỗi, sau này thực tế sẽ cần mã hóa
    chucVu: { type: String },
    diaChi: { type: String },
    soDienThoai: { type: String }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('NhanVien', nhanVienSchema);