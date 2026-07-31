const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
    // Liên kết với bảng Độc Giả thay vì chỉ lưu mã dạng chuỗi
    docGiaId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DocGia', 
        required: true 
    },
    // Liên kết với bảng Sách
    sachId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sach', 
        required: true 
    },
    ngayMuon: { 
        type: Date, 
        default: Date.now // Nếu không nhập, mặc định sẽ lấy ngày giờ hiện tại
    },
    ngayTra: { 
        type: Date 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);