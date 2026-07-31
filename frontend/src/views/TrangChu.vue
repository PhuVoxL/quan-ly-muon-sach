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
      <div class="col-md-4 mb-3">
        <div class="card text-white bg-primary h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Tổng Số Sách</h5>
            <h1 class="display-4 fw-bold">{{ tongSoSach }}</h1>
            <p class="card-text">Đầu sách đang được quản lý</p>
          </div>
          <div class="card-footer bg-transparent border-0 mb-2">
            <router-link to="/sach" class="btn btn-light text-primary fw-bold">Quản lý ngay</router-link>
          </div>
        </div>
      </div>

      <!-- Thống kê Độc Giả -->
      <div class="col-md-4 mb-3">
        <div class="card text-white bg-success h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Tổng Số Độc Giả</h5>
            <h1 class="display-4 fw-bold">{{ tongSoDocGia }}</h1>
            <p class="card-text">Độc giả đã đăng ký thành viên</p>
          </div>
          <div class="card-footer bg-transparent border-0 mb-2">
            <router-link to="/docgia" class="btn btn-light text-success fw-bold">Quản lý ngay</router-link>
          </div>
        </div>
      </div>

      <!-- Thống kê Mượn Trả -->
      <div class="col-md-4 mb-3">
        <div class="card text-white bg-info h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Đang Cho Mượn</h5>
            <h1 class="display-4 fw-bold">{{ soSachDangMuon }}</h1>
            <p class="card-text">Phiếu mượn chưa trả sách</p>
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
const soSachDangMuon = ref(0);

// Hàm gọi API lấy dữ liệu và tính toán
const thongKeDuLieu = async () => {
  try {
    // Dùng Promise.all để gọi 3 API cùng một lúc cho tốc độ tải nhanh hơn
    const [resSach, resDocGia, resPhieuMuon] = await Promise.all([
      axios.get('http://localhost:3000/api/sach'),
      axios.get('http://localhost:3000/api/docgia'),
      axios.get('http://localhost:3000/api/theodoimuonsach')
    ]);

    // Đếm số lượng phần tử trong mảng dữ liệu trả về
    tongSoSach.value = resSach.data.length;
    tongSoDocGia.value = resDocGia.data.length;
    
    // Đếm số phiếu mượn có trường "ngayTra" bị bỏ trống (tức là chưa trả)
    const danhSachPhieu = resPhieuMuon.data;
    const phieuChuaTra = danhSachPhieu.filter(phieu => !phieu.ngayTra);
    soSachDangMuon.value = phieuChuaTra.length;

  } catch (error) {
    console.error('Lỗi khi tải dữ liệu thống kê:', error);
  }
};

onMounted(() => {
  thongKeDuLieu();
});
</script>