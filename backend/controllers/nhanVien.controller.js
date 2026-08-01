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
// Cập nhật Nhân viên
// Cập nhật Nhân viên
exports.update = async (req, res) => {
    try {
        // Tạo một bản sao của dữ liệu gửi lên
        const updateData = { ...req.body };

        // Kiểm tra xem Nhân viên có nhập mật khẩu mới không
        if (updateData.password && updateData.password.trim() !== '') {
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        } else {
            // Xóa trường password khỏi object để không ghi đè mật khẩu rỗng vào CSDL
            delete updateData.password;
        }

        const nvCapNhat = await NhanVien.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true }
        );

        if (!nvCapNhat) return res.status(404).json({ message: "Không tìm thấy Nhân viên" });
        res.status(200).json(nvCapNhat);
        
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Lỗi: Mã Nhân viên hoặc Email đã tồn tại!" });
        }
        res.status(500).json({ message: "Lỗi Server khi cập nhật", error });
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