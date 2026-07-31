import { createRouter, createWebHistory } from 'vue-router';
import TrangChu from '../views/TrangChu.vue';
import NhaXuatBan from '../views/NhaXuatBan.vue';
import Sach from '../views/Sach.vue';
import DocGia from '../views/DocGia.vue';
import MuonTra from '../views/MuonTra.vue';
import NhanVien from '../views/NhanVien.vue';

const routes = [
    { path: '/', component: TrangChu },
    { path: '/nhaxuatban', component: NhaXuatBan },
    { path: '/sach', component: Sach },
    { path: '/docgia', component: DocGia },
    { path: '/muontra', component: MuonTra },
    { path: '/nhanvien', component: NhanVien }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;