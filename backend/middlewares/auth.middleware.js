const jwt = require('jsonwebtoken');
const SECRET_KEY = "thu_vien_secret_key"; // Phải giống hệt key bên auth.controller.js

// 1. Bảo vệ chặn khách vãng lai: Kiểm tra xem người dùng đã đăng nhập chưa
exports.verifyToken = (req, res, next) => {
    // Lấy token từ header của request
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Vui lòng đăng nhập để thực hiện chức năng này!" });
    }

    try {
        // Giải mã token để lấy thông tin (id, role)
        const decoded = jwt.verify(token, SECRET_KEY);
        // Gắn thông tin người dùng vào req để các controller phía sau có thể sử dụng
        req.user = decoded; 
        next(); // Cho phép đi qua cửa
    } catch (error) {
        res.status(403).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn!" });
    }
};

// 2. Bảo vệ chặn Độc giả: Kiểm tra xem người dùng có phải là Nhân viên không
exports.verifyNhanVien = (req, res, next) => {
    // Phải đi qua cửa verifyToken trước để có req.user
    if (req.user && req.user.role === 'nhanvien') {
        next(); // Là nhân viên -> Cho qua
    } else {
        res.status(403).json({ message: "Truy cập bị từ chối! Chức năng này chỉ dành cho Nhân viên." });
    }
};