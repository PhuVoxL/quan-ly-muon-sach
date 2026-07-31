const mongoose = require('mongoose');

const danhGiaSchema = new mongoose.Schema({
    // Ai là người đánh giá? (Liên kết với bảng Độc Giả)
    docGiaId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocGia', required: true },
    // Đánh giá cuốn sách nào? (Liên kết với bảng Sách)
    sachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },
    // Số sao (Từ 1 đến 5)
    diemDanhGia: { type: Number, required: true, min: 1, max: 5 },
    // Nội dung bình luận
    noiDung: { type: String, required: true }
}, {
    // timestamps tự động tạo createdAt (thời gian bình luận) và updatedAt
    timestamps: true 
});

module.exports = mongoose.model('DanhGia', danhGiaSchema);