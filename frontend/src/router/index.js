import { createRouter, createWebHistory } from 'vue-router';

// Tạm thời tạo một nội dung rỗng cho Trang chủ để kiểm tra
const TrangChu = { template: '<div><h1 class="text-primary">Chào mừng đến với Hệ thống Quản lý mượn sách!</h1></div>' };

// Khai báo các đường dẫn
const routes = [
    { 
        path: '/', // Khi truy cập đường dẫn gốc
        component: TrangChu // Sẽ hiển thị nội dung của TrangChu
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;