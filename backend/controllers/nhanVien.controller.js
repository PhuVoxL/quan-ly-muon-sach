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
// Cập nhật Độc giả (Dành cho Nhân viên)
exports.update = async (req, res) => {
    try {
        // Kiểm tra xem Nhân viên có nhập mật khẩu mới không (khác rỗng)
        if (req.body.password && req.body.password.trim() !== '') {
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        } else {
            // RẤT QUAN TRỌNG: Nếu nhân viên để trống ô mật khẩu, ta phải xóa trường này 
            // khỏi gói dữ liệu để MongoDB không ghi đè làm mất mật khẩu cũ của Độc giả
            delete req.body.password;
        }

        const docGiaCapNhat = await DocGia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!docGiaCapNhat) return res.status(404).json({ message: "Không tìm thấy Độc giả" });
        res.status(200).json(docGiaCapNhat);
    } catch (error) {
        // Bắt thêm lỗi E11000 của MongoDB trong trường hợp Nhân viên đổi email 
        // nhưng lại vô tình nhập trùng email của người khác
        if (error.code === 11000) {
            return res.status(400).json({ message: "Lỗi: Email hoặc Mã Độc giả đã bị trùng!" });
        }
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