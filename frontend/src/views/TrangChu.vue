<template>
  <div>
    <!-- Phần chào mừng chung -->
    <div class="p-5 mb-4 bg-light rounded-3 text-center shadow-sm">
      <h1 class="display-5 fw-bold text-primary">Thư Viện Tri Thức</h1>
      <p class="col-md-8 mx-auto fs-5 text-muted">
        Khám phá hàng ngàn đầu sách hấp dẫn. Không gian học tập và giải trí tuyệt vời dành cho bạn.
      </p>
    </div>

    <!-- GIAO DIỆN 1: DÀNH CHO NHÂN VIÊN QUẢN TRỊ (Giữ nguyên Dashboard cũ) -->
    <div class="row text-center mt-4" v-if="isNhanVien">
      <h3 class="mb-4 text-start fw-bold">Thống kê hoạt động</h3>
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-primary h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">Tổng Số Sách</h5><h1 class="display-4 fw-bold">{{ tongSoSach }}</h1>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-success h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">Tổng Độc Giả</h5><h1 class="display-4 fw-bold">{{ tongSoDocGia }}</h1>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-dark bg-warning h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">Chờ Phê Duyệt</h5><h1 class="display-4 fw-bold">{{ yeuCauChoDuyet }}</h1>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-info h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title text-dark">Đang Cho Mượn</h5><h1 class="display-4 fw-bold text-dark">{{ soSachDangMuon }}</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- GIAO DIỆN 2: DÀNH CHO KHÁCH & ĐỘC GIẢ (Hiển thị Top 3 Sách) -->
    <div class="mt-2" v-else>
      <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h3 class="fw-bold text-danger mb-0">🔥 Sách mượn nhiều nhất tháng</h3>
        <router-link to="/timsach" class="btn btn-outline-primary btn-sm">Xem tất cả</router-link>
      </div>
      
      <div class="row">
        <div class="col-md-4 mb-4" v-for="item in top3Sach" :key="item.sach._id">
          <div class="card h-100 shadow-sm border-0 bg-light">
            <img :src="item.sach.hinhAnh || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'" 
                 class="card-img-top object-fit-cover" style="height: 300px;" alt="Bìa sách">
            <div class="card-body text-center">
              <h5 class="card-title fw-bold text-dark mb-2">{{ item.sach.tenSach }}</h5>
              <p class="text-muted small mb-2">Tác giả: {{ item.sach.tacGia }}</p>
              <span class="badge bg-danger rounded-pill px-3 py-2">Đã mượn {{ item.soLuotMuon }} lần</span>
            </div>
            <div class="card-footer bg-transparent border-0 pb-3 text-center">
              <router-link :to="`/chitiet/${item.sach._id}`" class="btn btn-primary w-100 fw-bold">Mượn Ngay</router-link>
            </div>
          </div>
        </div>

        <div v-if="top3Sach.length === 0" class="col-12 text-center text-muted py-5">
          <h5>Tháng này chưa có dữ liệu mượn sách.</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Biến phân quyền
const isNhanVien = ref(false);

// Biến cho Nhân viên
const tongSoSach = ref(0);
const tongSoDocGia = ref(0);
const yeuCauChoDuyet = ref(0);
const soSachDangMuon = ref(0);

// Biến cho Khách/Độc giả
const top3Sach = ref([]);

const kiemTraPhanQuyen = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.role === 'nhanvien') isNhanVien.value = true;
  }
};

const taiDuLieuNhanVien = async () => {
  try {
    const [resSach, resDocGia, resPhieuMuon] = await Promise.all([
      axios.get('http://localhost:3000/api/sach'),
      axios.get('http://localhost:3000/api/docgia'),
      axios.get('http://localhost:3000/api/theodoimuonsach')
    ]);

    tongSoSach.value = resSach.data.length;
    tongSoDocGia.value = resDocGia.data.length;
    yeuCauChoDuyet.value = resPhieuMuon.data.filter(p => p.trangThai === 'Chờ duyệt').length;
    soSachDangMuon.value = resPhieuMuon.data.filter(p => p.trangThai === 'Đang mượn' || p.trangThai === 'Yêu cầu gia hạn').length;
  } catch (error) {
    console.error('Lỗi tải dữ liệu Admin:', error);
  }
};

const taiDuLieuTop3 = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/theodoimuonsach/top3');
    top3Sach.value = res.data;
  } catch (error) {
    console.error('Lỗi tải Top 3:', error);
  }
};

onMounted(() => {
  kiemTraPhanQuyen();
  if (isNhanVien.value) {
    taiDuLieuNhanVien();
  } else {
    taiDuLieuTop3();
  }
});
</script>