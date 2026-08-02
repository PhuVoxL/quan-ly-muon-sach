<template>
  <div class="row justify-content-center mt-5 mb-5">
    <div class="col-md-7">
      <div class="card shadow-lg border-0">
        <div class="card-header bg-primary text-white text-center py-3">
          <h4 class="mb-0 fw-bold">Đăng Ký Thành Viên Thư Viện</h4>
        </div>
        <div class="card-body p-4 p-md-5">
          <form @submit.prevent="xuLyDangKy">
            
            <h6 class="text-muted fw-bold mb-3 border-bottom pb-2">Thông tin tài khoản</h6>
            <div class="row">
              <div class="col-md-4 mb-3">
                <input type="text" class="form-control" placeholder="Mã Độc Giả (Vd: DG001)" v-model="form.maDocGia" required>
              </div>
              <div class="col-md-8 mb-3">
                <input type="email" class="form-control" placeholder="Email đăng nhập" v-model="form.email" required>
              </div>
              <div class="col-md-12 mb-4">
                <input type="password" class="form-control" placeholder="Mật khẩu" v-model="form.password" required>
              </div>
            </div>

            <h6 class="text-muted fw-bold mb-3 border-bottom pb-2">Thông tin cá nhân</h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <input type="text" class="form-control" placeholder="Họ lót" v-model="form.hoLot" required>
              </div>
              <div class="col-md-6 mb-3">
                <input type="text" class="form-control" placeholder="Tên" v-model="form.ten" required>
              </div>
              
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted small mb-1">Ngày sinh</label>
                <input type="date" class="form-control" v-model="form.ngaySinh">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted small mb-1">Giới tính</label>
                <select class="form-select" v-model="form.phai">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <input type="text" class="form-control" placeholder="Số điện thoại" v-model="form.dienThoai">
              </div>
              <div class="col-md-6 mb-3">
                <input type="text" class="form-control" placeholder="Địa chỉ (Vd: Cần Thơ)" v-model="form.diaChi">
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100 mt-3 fw-bold shadow-sm">Hoàn Tất Đăng Ký</button>
            
            <div class="text-center mt-4">
              <span class="text-secondary">Đã có tài khoản? </span>
              <router-link to="/dangnhap" class="text-decoration-none fw-bold">Đăng nhập ngay</router-link>
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

// Cập nhật cấu trúc biến form khớp với DB
const form = ref({ 
  maDocGia: '', 
  hoLot: '', 
  ten: '', 
  ngaySinh: '', 
  phai: 'Nam', // Giá trị mặc định
  diaChi: '', 
  dienThoai: '', 
  email: '', 
  password: '' 
});

const xuLyDangKy = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/register', form.value);
    alert(res.data.message);
    router.push('/dangnhap'); 
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký!');
  }
};
</script>