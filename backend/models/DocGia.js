const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
    maDocGia: { type: String, required: true, unique: true },
    hoLot: { type: String },
    ten: { type: String, required: true },
    ngaySinh: { type: Date }, // Kiểu Date dùng để lưu ngày tháng
    phai: { type: String }, // Giới tính (Nam/Nữ)
    diaChi: { type: String },
    dienThoai: { type: String }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('DocGia', docGiaSchema);