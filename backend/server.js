const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Kích hoạt đọc file .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Kết nối với MongoDB thông qua Mongoose
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Ket noi MongoDB thanh cong!');
    })
    .catch((error) => {
        console.error('Loi ket noi MongoDB:', error);
    });


    const nhaXuatBanRoute = require('./routes/nhaXuatBan.route');
    app.use('/api/nhaxuatban', nhaXuatBanRoute);


    const docGiaRoute = require('./routes/docGia.route');
    app.use('/api/docgia', docGiaRoute);

    const sachRoute = require('./routes/sach.route');
    app.use('/api/sach', sachRoute);


    const nhanVienRoute = require('./routes/nhanVien.route');
    app.use('/api/nhanvien', nhanVienRoute);

    const theoDoiMuonSachRoute = require('./routes/theoDoiMuonSach.route');
    app.use('/api/theodoimuonsach', theoDoiMuonSachRoute);

    const authRoute = require('./routes/auth.route');
    app.use('/api/auth', authRoute);
    
    
    const danhGiaRoute = require('./routes/danhGia.route');
    app.use('/api/danhgia', danhGiaRoute);

// Đường dẫn kiểm tra
app.get('/', (req, res) => {
    res.send('Xin chao! Backend Quan ly muon sach dang chay!');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server dang chay tai cong ${PORT}`);
});