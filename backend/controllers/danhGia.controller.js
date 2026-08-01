const DanhGia = require('../models/DanhGia');

// Tạo đánh giá mới (Dành cho Độc giả)
exports.create = async (req, res) => {
    try {
        // req.user.id được truyền từ middleware verifyToken sang
        const newDanhGia = new DanhGia({
            ...req.body,
            docGiaId: req.user.id 
        });
        const savedDanhGia = await newDanhGia.save();
        res.status(200).json(savedDanhGia);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi gửi đánh giá", error });
    }
};

// Lấy toàn bộ đánh giá của 1 cuốn sách (Dành cho tất cả mọi người)
exports.findBySach = async (req, res) => {
    try {
        
 const danhSach = await DanhGia.find({ sachId: req.params.sachId })
    .populate('docGiaId', 'ten hoLot avatar') // Đã thêm avatar
    .sort({ createdAt: -1 });
            
        res.status(200).json(danhSach);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy đánh giá", error });
    }
};