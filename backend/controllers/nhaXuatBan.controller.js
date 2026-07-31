const NhaXuatBan = require('../models/NhaXuatBan');

// Hàm 1: Thêm một Nhà xuất bản mới
exports.create = async (req, res) => {
    try {
        // req.body chứa dữ liệu mà Frontend gửi lên
        const newNhaXuatBan = new NhaXuatBan(req.body);
        const savedNhaXuatBan = await newNhaXuatBan.save();
        
        // res.status(200) là mã thành công, trả về dữ liệu vừa lưu dạng JSON
        res.status(200).json(savedNhaXuatBan);
    } catch (error) {
        // Nếu có lỗi (ví dụ: trùng mã NXB), trả về lỗi 500
        res.status(500).json({ message: "Loi khi them Nha xuat ban", error });
    }
};

// Hàm 2: Lấy danh sách tất cả Nhà xuất bản
exports.findAll = async (req, res) => {
    try {
        const danhSachNXB = await NhaXuatBan.find();
        res.status(200).json(danhSachNXB);
    } catch (error) {
        res.status(500).json({ message: "Loi khi lay danh sach", error });
    }
};