const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Cấp phép cho Frontend gọi API
app.use(cors());
// Cho phép Express đọc dữ liệu truyền lên dưới định dạng JSON
app.use(express.json());

// Tạo một đường dẫn (route) cơ bản để kiểm tra
app.get('/', (req, res) => {
    res.send('Xin chao! Backend Quan ly muon sach dang chay!');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server dang chay tai cong ${PORT}`);
});