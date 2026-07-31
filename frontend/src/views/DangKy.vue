<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-6">
      <div class="card shadow">
        <div class="card-header bg-primary text-white text-center">
          <h4>Đăng Ký Tài Khoản Độc Giả</h4>
        </div>
        <div class="card-body p-4">
          <form @submit.prevent="xuLyDangKy">
            <div class="mb-3">
              <input type="text" class="form-control" placeholder="Mã Độc Giả (Vd: DG001)" v-model="form.maDocGia" required>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" placeholder="Họ và Tên" v-model="form.ten" required>
            </div>
            <div class="mb-3">
              <input type="email" class="form-control" placeholder="Email đăng nhập" v-model="form.email" required>
            </div>
            <div class="mb-3">
              <input type="password" class="form-control" placeholder="Mật khẩu" v-model="form.password" required>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" placeholder="Số điện thoại" v-model="form.dienThoai">
            </div>
            <button type="submit" class="btn btn-primary w-100">Đăng Ký</button>
            <div class="text-center mt-3">
              <span>Đã có tài khoản? </span>
              <router-link to="/dangnhap" class="text-decoration-none">Đăng nhập ngay</router-link>
            </div>
          </form>
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
const form = ref({ maDocGia: '', ten: '', email: '', password: '', dienThoai: '' });

const xuLyDangKy = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/register', form.value);
    alert(res.data.message);
    router.push('/dangnhap'); // Đăng ký xong tự động chuyển sang trang đăng nhập
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký!');
  }
};
</script>