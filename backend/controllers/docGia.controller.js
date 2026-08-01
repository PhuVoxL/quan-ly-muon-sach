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


// Lấy thông tin cá nhân (Dành riêng cho Độc giả đang đăng nhập)
exports.getProfile = async (req, res) => {
    try {
        // req.user.id được lấy từ Token đăng nhập
        const docGia = await DocGia.findById(req.user.id);
        if (!docGia) return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
        res.status(200).json(docGia);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error });
    }
};

// Cập nhật thông tin cá nhân (Dành riêng cho Độc giả)
exports.updateProfile = async (req, res) => {
    try {
        if (req.body.password) {
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        } else {
            // Nếu người dùng không nhập pass mới, ta xóa trường này đi để không bị ghi đè mật khẩu rỗng vào DB
            delete req.body.password; 
        }

        const docGiaCapNhat = await DocGia.findByIdAndUpdate(req.user.id, req.body, { new: true });
        res.status(200).json(docGiaCapNhat);
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật", error });
    }
};