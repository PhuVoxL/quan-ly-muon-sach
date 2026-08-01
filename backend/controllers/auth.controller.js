const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Chuỗi bí mật để tạo token (Trong thực tế sẽ giấu vào file .env, ở đây ta để tạm để dễ code)
const SECRET_KEY = "thu_vien_secret_key";

// 1. Hàm Đăng ký tài khoản (Dành cho Khách vãng lai muốn thành Độc giả)
exports.register = async (req, res) => {
    try {
        // Lấy đầy đủ thông tin từ form
        const { maDocGia, hoLot, ten, ngaySinh, phai, diaChi, dienThoai, email, password } = req.body;

        // Kiểm tra xem email hoặc mã độc giả đã tồn tại chưa
        const checkEmail = await DocGia.findOne({ email });
        const checkMa = await DocGia.findOne({ maDocGia });
        if (checkEmail) return res.status(400).json({ message: "Email này đã được sử dụng!" });
        if (checkMa) return res.status(400).json({ message: "Mã độc giả này đã tồn tại!" });

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo Độc giả mới (avatar sẽ tự động lấy giá trị default)
        const newDocGia = new DocGia({
            maDocGia, hoLot, ten, ngaySinh, phai, diaChi, dienThoai, email, password: hashedPassword
        });
        
        await newDocGia.save();
        res.status(200).json({ message: "Đăng ký tài khoản thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đăng ký", error });
    }
};

// 2. Hàm Đăng nhập cho Độc Giả
exports.loginDocGia = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm độc giả theo email
        const docGia = await DocGia.findOne({ email });
        if (!docGia) return res.status(404).json({ message: "Email không tồn tại!" });

        // So sánh mật khẩu
        const validPassword = await bcrypt.compare(password, docGia.password);
        if (!validPassword) return res.status(400).json({ message: "Mật khẩu không đúng!" });

        // Tạo Token chứa thông tin cơ bản
        const token = jwt.sign({ id: docGia._id, role: 'docgia' }, SECRET_KEY, { expiresIn: '1d' });
        
        res.status(200).json({ 
            message: "Đăng nhập Độc giả thành công!", 
            token, 
            user: { id: docGia._id, ten: docGia.ten, email: docGia.email, role: 'docgia' }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi đăng nhập", error });
    }
};

// 3. Hàm Đăng nhập cho Nhân Viên
exports.loginNhanVien = async (req, res) => {
    try {
        // Giả sử nhân viên dùng msnv (Mã số nhân viên) để đăng nhập
        const { msnv, password } = req.body;

        const nhanVien = await NhanVien.findOne({ msnv });
        if (!nhanVien) return res.status(404).json({ message: "Mã nhân viên không tồn tại!" });

        // Tạm thời so sánh trực tiếp vì form cũ ta chưa mã hóa pass của nhân viên. 
        // (Nếu sau này bạn mã hóa pass nhân viên lúc thêm mới, ta sẽ dùng bcrypt.compare ở đây)
        if (password !== nhanVien.password) return res.status(400).json({ message: "Mật khẩu không đúng!" });

        const token = jwt.sign({ id: nhanVien._id, role: 'nhanvien' }, SECRET_KEY, { expiresIn: '1d' });
        
        res.status(200).json({ 
            message: "Đăng nhập Nhân viên thành công!", 
            token, 
            user: { id: nhanVien._id, hoTen: nhanVien.hoTenNV, role: 'nhanvien' }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi đăng nhập", error });
    }
};