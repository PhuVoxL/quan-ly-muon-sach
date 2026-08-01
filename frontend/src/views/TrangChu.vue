<template>
  <div>
    <div class="p-5 mb-4 bg-light rounded-3 text-center">
      <h1 class="display-5 fw-bold text-primary">Hệ Thống Quản Lý Thư Viện</h1>
      <p class="col-md-8 mx-auto fs-4">
        Chào mừng bạn đến với trang quản trị. Dưới đây là tình hình hoạt động tổng quan của thư viện.
      </p>
    </div>

    <div class="row text-center">
      <!-- Thống kê Sách -->
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-primary h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">Tổng Số Sách</h5>
            <h1 class="display-4 fw-bold">{{ tongSoSach }}</h1>
            <p class="card-text">Đầu sách trong kho</p>
          </div>
          <div class="card-footer bg-transparent border-0 mb-2">
            <router-link to="/sach" class="btn btn-light text-primary fw-bold">Quản lý ngay</router-link>
          </div>
        </div>
      </div>

      <!-- Thống kê Độc Giả -->
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-success h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">Tổng Độc Giả</h5>
            <h1 class="display-4 fw-bold">{{ tongSoDocGia }}</h1>
            <p class="card-text">Tài khoản thành viên</p>
          </div>
          <div class="card-footer bg-transparent border-0 mb-2">
            <router-link to="/docgia" class="btn btn-light text-success fw-bold">Quản lý ngay</router-link>
          </div>
        </div>
      </div>

      <!-- Thống kê Yêu cầu Chờ duyệt -->
      <div class="col-md-3 mb-3">
        <div class="card text-dark bg-warning h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">Chờ Phê Duyệt</h5>
            <h1 class="display-4 fw-bold">{{ yeuCauChoDuyet }}</h1>
            <p class="card-text">Phiếu yêu cầu mới</p>
          </div>
          <div class="card-footer bg-transparent border-0 mb-2">
            <router-link to="/muontra" class="btn btn-light text-warning fw-bold">Xử lý ngay</router-link>
          </div>
        </div>
      </div>

      <!-- Thống kê Đang mượn -->
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-info h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title text-dark">Đang Cho Mượn</h5>
            <h1 class="display-4 fw-bold text-dark">{{ soSachDangMuon }}</h1>
            <p class="card-text text-dark">Sách chưa trả về kho</p>
          </div>
          <div class="card-footer bg-transparent border-0 mb-2">
            <router-link to="/muontra" class="btn btn-light text-info fw-bold">Xem chi tiết</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Khai báo các biến lưu trữ con số thống kê
const tongSoSach = ref(0);
const tongSoDocGia = ref(0);
const yeuCauChoDuyet = ref(0);
const soSachDangMuon = ref(0);

// Hàm gọi API lấy dữ liệu và tính toán
const thongKeDuLieu = async () => {
  try {
    const [resSach, resDocGia, resPhieuMuon] = await Promise.all([
      axios.get('http://localhost:3000/api/sach'),
      axios.get('http://localhost:3000/api/docgia'),
      axios.get('http://localhost:3000/api/theodoimuonsach')
    ]);

    // Gán dữ liệu số lượng cơ bản
    tongSoSach.value = resSach.data.length;
    tongSoDocGia.value = resDocGia.data.length;
    
    // Đếm số lượng phiếu mượn theo từng trạng thái cụ thể
    const danhSachPhieu = resPhieuMuon.data;
    
    yeuCauChoDuyet.value = danhSachPhieu.filter(phieu => phieu.trangThai === 'Chờ duyệt').length;
    soSachDangMuon.value = danhSachPhieu.filter(phieu => 
      phieu.trangThai === 'Đang mượn' || phieu.trangThai === 'Yêu cầu gia hạn'
    ).length;

  } catch (error) {
    console.error('Lỗi khi tải dữ liệu thống kê:', error);
  }
};

onMounted(() => {
  thongKeDuLieu();
});
</script>