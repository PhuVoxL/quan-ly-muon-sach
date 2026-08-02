const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
    docGiaId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocGia', required: true },
    sachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },
    ngayMuon: { type: Date, required: true },
    ngayTra: { type: Date },
    // --- THÊM TRƯỜNG TRẠNG THÁI ĐỂ QUẢN LÝ QUY TRÌNH ---
    trangThai: { 
        type: String, 
        // enum giúp giới hạn các giá trị hợp lệ, không cho phép nhập sai chính tả
        enum: ['Chờ duyệt', 'Đang mượn', 'Yêu cầu gia hạn', 'Đã trả', 'Từ chối'], 
        default: 'Chờ duyệt' // Mặc định khi độc giả gửi yêu cầu sẽ là Chờ duyệt
    },
    nhanVienDuyetId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'NhanVien',
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);