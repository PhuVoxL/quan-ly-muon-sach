<template>
  <div>
    <!-- Thanh Điều Hướng (Navbar) -->
    <!-- Thanh Điều Hướng (Navbar) -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">Thư Viện</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- NHÓM MENU BÊN TRÁI -->
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Trang Chủ</router-link>
            </li>
            
            <li class="nav-item" v-if="!isNhanVien">
              <router-link class="nav-link" to="/timsach">Tìm Sách</router-link>
            </li>
            
            <li class="nav-item" v-if="isDocGia">
              <router-link class="nav-link text-warning" to="/lichsu">Lịch Sử Mượn</router-link>
            </li>

            <template v-if="isNhanVien">
              <li class="nav-item"><router-link class="nav-link" to="/nhaxuatban">Nhà Xuất Bản</router-link></li>
              <li class="nav-item"><router-link class="nav-link" to="/sach">Quản Lý Sách</router-link></li>
              <li class="nav-item"><router-link class="nav-link" to="/docgia">Độc Giả</router-link></li>
              <li class="nav-item"><router-link class="nav-link text-info" to="/muontra">Mượn Trả</router-link></li>
              <li class="nav-item"><router-link class="nav-link text-warning" to="/nhanvien">Nhân Viên</router-link></li>
            </template>
          </ul>

          <!-- NHÓM MENU BÊN PHẢI (Tài khoản) -->
          <ul class="navbar-nav">
            <!-- Nếu đã đăng nhập: Hiện tên và nút Đăng xuất -->
            <li class="nav-item dropdown" v-if="isLoggedIn">
              <a class="nav-link dropdown-toggle fw-bold text-success" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                Chào, {{ userName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                <li v-if="isDocGia">
                  <router-link class="dropdown-item text-primary fw-bold" to="/thongtin">Cập nhật hồ sơ</router-link>
                </li>
                <!-- Đường kẻ ngang chỉ hiện cho Độc giả -->
                <li v-if="isDocGia"><hr class="dropdown-divider"></li>
                <!-- Nút đăng xuất dùng chung cho cả Nhân viên và Độc giả -->
                <li><a class="dropdown-item text-danger fw-bold" href="#" @click.prevent="dangXuat">Đăng xuất</a></li>
              </ul>
            </li>
            
            <!-- Nếu CHƯA đăng nhập: Hiện nút Đăng nhập / Đăng ký -->
            <template v-else>
              <li class="nav-item"><router-link class="nav-link" to="/dangnhap">Đăng Nhập</router-link></li>
              <li class="nav-item"><router-link class="btn btn-primary btn-sm mt-1 ms-2" to="/dangky">Đăng Ký</router-link></li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Nơi hiển thị các trang con -->
    <div class="container mt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Các biến trạng thái để điều khiển giao diện
const isLoggedIn = ref(false);
const isDocGia = ref(false);
const isNhanVien = ref(false);
const userName = ref('');

// Khi trang web tải lên, kiểm tra xem có thông tin đăng nhập trong ví không
onMounted(() => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    isLoggedIn.value = true;
    const user = JSON.parse(userStr);
    
    // Độc giả lưu là 'ten', Nhân viên lưu là 'hoTen'
    userName.value = user.ten || user.hoTen; 
    
    // Kiểm tra quyền (Role)
    if (user.role === 'docgia') isDocGia.value = true;
    if (user.role === 'nhanvien') isNhanVien.value = true;
  }
});

// Hàm xử lý Đăng xuất
const dangXuat = () => {
  // 1. Xóa toàn bộ dữ liệu trong ví (localStorage)
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // 2. Tải lại trang web và đẩy về trang đăng nhập
  // (Dùng window.location thay vì router.push để trình duyệt xóa sạch bộ nhớ tạm)
  window.location.href = '/dangnhap';
};
</script>