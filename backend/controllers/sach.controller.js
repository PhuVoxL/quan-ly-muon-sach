const Sach = require('../models/Sach');

exports.create = async (req, res) => {
    try {
        const newSach = new Sach(req.body);
        const savedSach = await newSach.save();
        res.status(200).json(savedSach);
    } catch (error) {
        res.status(500).json({ message: "Loi khi them Sach", error });
    }
};

exports.findAll = async (req, res) => {
    try {
        // Lệnh populate giúp thay thế ID của nhà xuất bản bằng toàn bộ thông tin chi tiết của nhà xuất bản đó
        const danhSachSach = await Sach.find().populate('nhaXuatBanId');
        res.status(200).json(danhSachSach);
    } catch (error) {
        res.status(500).json({ message: "Loi khi lay danh sach", error });
    }
};

// Xóa Sách
exports.delete = async (req, res) => {
    try {
        const sachBiXoa = await Sach.findByIdAndDelete(req.params.id);
        if (!sachBiXoa) return res.status(404).json({ message: "Không tìm thấy Sách" });
        res.status(200).json({ message: "Xóa thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error });
    }
};

// Cập nhật Sách
exports.update = async (req, res) => {
    try {
        const sachCapNhat = await Sach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sachCapNhat) return res.status(404).json({ message: "Không tìm thấy Sách" });
        res.status(200).json(sachCapNhat);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật", error });
    }
};