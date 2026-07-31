import { createRouter, createWebHistory } from 'vue-router';
import TrangChu from '../views/TrangChu.vue';
import NhaXuatBan from '../views/NhaXuatBan.vue';
import Sach from '../views/Sach.vue';
import DocGia from '../views/DocGia.vue';
import MuonTra from '../views/MuonTra.vue';
import NhanVien from '../views/NhanVien.vue';
// Thêm 2 file mới
import DangNhap from '../views/DangNhap.vue';
import DangKy from '../views/DangKy.vue';

import TimSach from '../views/TimSach.vue';
import ChiTietSach from '../views/ChiTietSach.vue';
import LichSuMuon from '../views/LichSuMuon.vue';


const routes = [
    { path: '/', component: TrangChu },
    { path: '/timsach', component: TimSach },
    { path: '/chitiet/:id', component: ChiTietSach },
    { path: '/nhaxuatban', component: NhaXuatBan },
    { path: '/sach', component: Sach },
    { path: '/docgia', component: DocGia },
    { path: '/muontra', component: MuonTra },
    { path: '/nhanvien', component: NhanVien },
    // Cánh cửa cho Khách
    { path: '/dangnhap', component: DangNhap },
    { path: '/dangky', component: DangKy },
    { path: '/lichsu', component: LichSuMuon },


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;