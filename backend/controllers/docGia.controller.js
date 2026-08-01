const bcrypt = require('bcrypt');

const DocGia = require('../models/DocGia');

exports.create = async (req, res) => {
    try {
        const newDocGia = new DocGia(req.body);
        const savedDocGia = await newDocGia.save();
        res.status(200).json(savedDocGia);
    } catch (error) {
        res.status(500).json({ message: "Loi khi them Doc gia", error });
    }
};

exports.findAll = async (req, res) => {
    try {
        const danhSachDocGia = await DocGia.find();
        res.status(200).json(danhSachDocGia);
    } catch (error) {
        res.status(500).json({ message: "Loi khi lay danh sach", error });
    }
};

// Cập nhật Độc giả (Có xử lý mã hóa mật khẩu nếu có thay đổi)
exports.update = async (req, res) => {
    try {
        // Kiểm tra nếu request có chứa mật khẩu mới
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const docGiaCapNhat = await DocGia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!docGiaCapNhat) return res.status(404).json({ message: "Không tìm thấy Độc giả" });
        res.status(200).json(docGiaCapNhat);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật", error });
    }
};

// Xóa Độc giả
exports.delete = async (req, res) => {
    try {
        const docGiaBiXoa = await DocGia.findByIdAndDelete(req.params.id);
        if (!docGiaBiXoa) return res.status(404).json({ message: "Không tìm thấy Độc giả" });
        res.status(200).json({ message: "Xóa thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error });
    }
};