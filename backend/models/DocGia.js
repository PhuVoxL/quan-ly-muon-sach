const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
    maDocGia: { type: String, required: true, unique: true },
    hoLot: { type: String },
    ten: { type: String, required: true },
    ngaySinh: { type: Date },
    phai: { type: String },
    diaChi: { type: String },
    dienThoai: { type: String },



    // --- THÊM 2 TRƯỜNG MỚI ĐỂ PHỤC VỤ ĐĂNG NHẬP ---
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    // Thêm dòng này vào bên dưới trường password
    avatar: { 
    type: String, 
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' 
}


}, {
    timestamps: true
});

module.exports = mongoose.model('DocGia', docGiaSchema);