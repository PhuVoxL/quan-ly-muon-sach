<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-5">
      <div class="card shadow">
        <div class="card-header bg-dark text-white text-center">
          <h4>Đăng Nhập Hệ Thống</h4>
        </div>
        <div class="card-body p-4">
          <!-- Điều hướng Tab (Nav Tabs của Bootstrap) -->
          <ul class="nav nav-tabs mb-4" id="loginTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active fw-bold" id="docgia-tab" data-bs-toggle="tab" data-bs-target="#docgia" type="button" role="tab">Độc Giả</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link fw-bold text-danger" id="nhanvien-tab" data-bs-toggle="tab" data-bs-target="#nhanvien" type="button" role="tab">Nhân Viên</button>
            </li>
          </ul>

          <div class="tab-content" id="loginTabContent">
            <!-- TAB ĐỘC GIẢ -->
            <div class="tab-pane fade show active" id="docgia" role="tabpanel">
              <form @submit.prevent="dangNhapDocGia">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="formDocGia.email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <input type="password" class="form-control" v-model="formDocGia.password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 mb-3">Đăng Nhập</button>
                <div class="text-center">
                  <span>Chưa có tài khoản? </span>
                  <router-link to="/dangky" class="text-decoration-none">Đăng ký</router-link>
                </div>
              </form>
            </div>

            <!-- TAB NHÂN VIÊN -->
            <div class="tab-pane fade" id="nhanvien" role="tabpanel">
              <form @submit.prevent="dangNhapNhanVien">
                <div class="mb-3">
                  <label class="form-label">Mã Nhân Viên</label>
                  <input type="text" class="form-control" v-model="formNhanVien.msnv" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <input type="password" class="form-control" v-model="formNhanVien.password" required>
                </div>
                <button type="submit" class="btn btn-danger w-100">Đăng Nhập Quản Trị</button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const formDocGia = ref({ email: '', password: '' });
const formNhanVien = ref({ msnv: '', password: '' });

// Hàm lưu dữ liệu vào ví (localStorage)
const luuThongTin = (data) => {
  localStorage.setItem('token', data.token); // Lưu token
  localStorage.setItem('user', JSON.stringify(data.user)); // Lưu thông tin (tên, role)
}

const dangNhapDocGia = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login-docgia', formDocGia.value);
    luuThongTin(res.data);
    alert(res.data.message);
    window.location.href = '/'
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi đăng nhập');
  }
};

const dangNhapNhanVien = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login-nhanvien', formNhanVien.value);
    luuThongTin(res.data);
    alert(res.data.message);
    window.location.href = '/'
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi đăng nhập');
  }
};
</script>