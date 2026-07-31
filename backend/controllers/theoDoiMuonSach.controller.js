const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');

exports.create = async (req, res) => {
    try {
        const newPhieuMuon = new TheoDoiMuonSach(req.body);
        const savedPhieuMuon = await newPhieuMuon.save();
        res.status(200).json(savedPhieuMuon);
    } catch (error) {
        res.status(500).json({ message: "Loi khi tao phieu muon sach", error });
    }
};

exports.findAll = async (req, res) => {
    try {
        // Dùng populate 2 lần để lấy ra chi tiết thông tin Độc Giả và chi tiết cuốn Sách
        const danhSachPhieuMuon = await TheoDoiMuonSach.find()
            .populate('docGiaId')
            .populate('sachId');
        res.status(200).json(danhSachPhieuMuon);
    } catch (error) {
        res.status(500).json({ message: "Loi khi lay danh sach phieu muon", error });
    }
};