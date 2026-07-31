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