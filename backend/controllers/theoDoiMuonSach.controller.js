const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
// Import thêm model Sách để có thể lấy ra và trừ số lượng
const Sach = require('../models/Sach'); 

// 1. Tạo phiếu mượn mới (Và trừ số lượng sách)
exports.create = async (req, res) => {
    try {
        // Lấy thông tin cuốn sách đang được mượn
        const sach = await Sach.findById(req.body.sachId);
        
        // Kiểm tra nếu sách không tồn tại hoặc đã hết số lượng
        if (!sach || sach.soQuyen <= 0) {
            return res.status(400).json({ message: "Sách này đã hết trong kho, không thể mượn!" });
        }

        // Tạo lưu phiếu mượn
        const newPhieuMuon = new TheoDoiMuonSach(req.body);
        const savedPhieuMuon = await newPhieuMuon.save();

        // Trừ đi 1 quyển và lưu lại bảng Sách
        sach.soQuyen -= 1;
        await sach.save();

        res.status(200).json(savedPhieuMuon);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo phiếu mượn sách", error });
    }
};

// 2. Lấy danh sách phiếu mượn (Giữ nguyên)
exports.findAll = async (req, res) => {
    try {
        const danhSachPhieuMuon = await TheoDoiMuonSach.find()
            .populate('docGiaId')
            .populate('sachId');
        res.status(200).json(danhSachPhieuMuon);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách phieu muon", error });
    }
};
// 3. Cập nhật phiếu mượn (Xử lý Duyệt, Từ chối, Trả sách)
exports.update = async (req, res) => {
    try {
        const phieuCu = await TheoDoiMuonSach.findById(req.params.id);
        if (!phieuCu) return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });

        const sach = await Sach.findById(phieuCu.sachId);
        const trangThaiMoi = req.body.trangThai;

        if (sach) {
            // Nhóm trạng thái sách đang "rời khỏi kho"
            const dangXuatKho = ['Chờ duyệt', 'Đang mượn', 'Yêu cầu gia hạn'];
            // Nhóm trạng thái sách "nằm trong kho"
            const dangTrongKho = ['Đã trả', 'Từ chối'];

            // Nếu trạng thái cũ là đang mượn/chờ duyệt, mà trạng thái mới là Đã trả/Từ chối -> Hoàn +1 vào kho
            if (dangXuatKho.includes(phieuCu.trangThai) && dangTrongKho.includes(trangThaiMoi)) {
                sach.soQuyen += 1;
                await sach.save();
            } 
            // Nếu nhân viên lỡ tay bấm nhầm "Từ chối", giờ đổi lại thành "Đang mượn" -> Trừ -1 kho
            else if (dangTrongKho.includes(phieuCu.trangThai) && dangXuatKho.includes(trangThaiMoi)) {
                sach.soQuyen -= 1;
                await sach.save();
            }
        }

        // Tự động gán ngày trả hôm nay nếu nhân viên chọn trạng thái "Đã trả" mà quên nhập ngày
        if (trangThaiMoi === 'Đã trả' && !req.body.ngayTra) {
            req.body.ngayTra = new Date();
        }

        // Tiến hành lưu cập nhật
        const phieuCapNhat = await TheoDoiMuonSach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(phieuCapNhat);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật", error });
    }
};

// 4. Xóa phiếu mượn (Hoàn lại sách nếu chưa trả)
exports.delete = async (req, res) => {
    try {
        const phieuBiXoa = await TheoDoiMuonSach.findById(req.params.id);
        if (!phieuBiXoa) return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });

        // LOGIC QUAN TRỌNG: Nếu xóa một phiếu mượn mà sách ĐANG MƯỢN (chưa trả), ta phải cộng lại sách vào kho
        if (!phieuBiXoa.ngayTra) {
            const sach = await Sach.findById(phieuBiXoa.sachId);
            if (sach) {
                sach.soQuyen += 1;
                await sach.save();
            }
        }

        // Sau khi hoàn trả sách xong mới tiến hành xóa phiếu
        await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error });
    }
};


// 5. Lấy lịch sử mượn sách của cá nhân (Dành cho Độc giả)
exports.findLichSuCaNhan = async (req, res) => {
    try {
        // req.user.id được lấy từ Token của người đang đăng nhập
        const docGiaId = req.user.id;
        
        // Lọc ra các phiếu mượn có docGiaId khớp với người dùng hiện tại
        const lichSu = await TheoDoiMuonSach.find({ docGiaId: docGiaId })
            .populate('sachId', 'tenSach tacGia hinhAnh') // Lấy thêm thông tin sách cho đẹp
            .sort({ createdAt: -1 }); // Mới nhất xếp trên cùng
            
        res.status(200).json(lichSu);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy lịch sử mượn sách", error });
    }
};


// 6. Độc giả gửi yêu cầu gia hạn sách
exports.yeuCauGiaHan = async (req, res) => {
    try {
        const phieu = await TheoDoiMuonSach.findById(req.params.id);
        if (!phieu) return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
        
        // Đổi trạng thái phiếu mượn
        phieu.trangThai = 'Yêu cầu gia hạn';
        await phieu.save();
        
        res.status(200).json({ message: "Đã gửi yêu cầu gia hạn thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi gửi yêu cầu", error });
    }
};


// 7. Thống kê Top 3 sách mượn nhiều nhất trong tháng (Dành cho Trang chủ)
exports.getTop3Thang = async (req, res) => {
    try {
        const now = new Date();
        // Lấy ngày đầu tiên của tháng hiện tại
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Tìm tất cả các phiếu mượn từ đầu tháng đến nay
        const phieuMuonThangNay = await TheoDoiMuonSach.find({
            ngayMuon: { $gte: startOfMonth }
        }).populate('sachId', 'tenSach hinhAnh tacGia');

        // Tạo một Object để đếm số lượt mượn của từng cuốn sách
        const thongKe = {};
        phieuMuonThangNay.forEach(phieu => {
            if (phieu.sachId) { // Đảm bảo sách chưa bị xóa khỏi hệ thống
                const id = phieu.sachId._id.toString();
                if (!thongKe[id]) {
                    thongKe[id] = { sach: phieu.sachId, soLuotMuon: 0 };
                }
                thongKe[id].soLuotMuon += 1; // Tăng biến đếm
            }
        });

        // Chuyển Object thành Mảng, sắp xếp giảm dần và cắt lấy 3 phần tử đầu tiên
        const top3 = Object.values(thongKe)
            .sort((a, b) => b.soLuotMuon - a.soLuotMuon)
            .slice(0, 3);

        res.status(200).json(top3);
    } catch (error) {
        res.status(500).json({ message: "Lỗi thống kê", error });
    }
};