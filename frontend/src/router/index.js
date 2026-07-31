import { createRouter, createWebHistory } from 'vue-router';
// Import file giao diện vừa tạo
import NhaXuatBan from '../views/NhaXuatBan.vue';
import Sach from '../views/Sach.vue';
import DocGia from '../views/DocGia.vue';
import MuonTra from '../views/MuonTra.vue';




const TrangChu = { template: '<div><h1 class="text-primary">Chào mừng đến với Hệ thống Quản lý mượn sách!</h1></div>' };

const routes = [
    { 
        path: '/', 
        component: TrangChu 
    },
    {
        // Khi truy cập domain/nhaxuatban -> Hiển thị trang NhaXuatBan.vue
        path: '/nhaxuatban',
        component: NhaXuatBan
    },
    { 
        path: '/sach', 
        component: Sach 
    },
    { 
        path: '/docgia', 
        component: DocGia 
    },
    { path: '/muontra', component: MuonTra }




];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;