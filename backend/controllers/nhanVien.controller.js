const bcrypt = require('bcrypt');

const NhanVien = require('../models/NhanVien');

exports.create = async (req, res) => {
    try {
        const newNhanVien = new NhanVien(req.body);
        const savedNhanVien = await newNhanVien.save();
        res.status(200).json(savedNhanVien);
    } catch (error) {
        res.status(500).json({ message: "Loi khi them Nhan vien", error });
    }
};

exports.findAll = async (req, res) => {
    try {
        const danhSachNhanVien = await NhanVien.find();
        res.status(200).json(danhSachNhanVien);
    } catch (error) {
        res.status(500).json({ message: "Loi khi lay danh sach", error });
    }
};


// Cập nhật thông tin Nhân viên
exports.update = async (req, res) => {

    try {
        // Kiểm tra nếu request có chứa mật khẩu mới
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const nhanVienCapNhat = await NhanVien.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!nhanVienCapNhat) return res.status(404).json({ message: "Không tìm thấy Nhân viên" });
        res.status(200).json(nhanVienCapNhat);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật", error });
    }

};

// Xóa Nhân viên
exports.delete = async (req, res) => {
    try {
        const nhanVienBiXoa = await NhanVien.findByIdAndDelete(req.params.id);
        if (!nhanVienBiXoa) return res.status(404).json({ message: "Không tìm thấy Nhân viên" });
        res.status(200).json({ message: "Xóa thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error });
    }
};