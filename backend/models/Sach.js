const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema({
    maSach: { type: String, required: true, unique: true },
    tenSach: { type: String, required: true },
    donGia: { type: Number, required: true }, // Kiểu Number dùng để lưu số tiền
    soQuyen: { type: Number, required: true },
    namXuatBan: { type: Number },
    tacGia: { type: String },
    
    // Đây là phần quan trọng: Liên kết với bảng NhaXuatBan
    nhaXuatBanId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'NhaXuatBan', 
        required: true 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Sach', sachSchema);