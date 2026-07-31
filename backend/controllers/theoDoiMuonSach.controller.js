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

// Cập nhật phiếu mượn (Ví dụ khi khách trả sách, ta cập nhật lại Ngày Trả)
exports.update = async (req, res) => {
    try {
        const phieuCapNhat = await TheoDoiMuonSach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!phieuCapNhat) return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
        res.status(200).json(phieuCapNhat);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật", error });
    }
};

// Xóa phiếu mượn
exports.delete = async (req, res) => {
    try {
        const phieuBiXoa = await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
        if (!phieuBiXoa) return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
        res.status(200).json({ message: "Xóa thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error });
    }
};