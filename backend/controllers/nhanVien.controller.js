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