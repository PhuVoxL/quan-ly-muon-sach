<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-8">
      <div class="card shadow-sm border-0">
        <div class="card-header bg-primary text-white text-center py-3">
          <h4 class="mb-0 fw-bold">Hồ Sơ Cá Nhân</h4>
        </div>
        <div class="card-body p-4">
          <form @submit.prevent="capNhatThongTin">
            <!-- Khu vực Avatar -->
            <div class="text-center mb-4">
              <img :src="form.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
                   class="rounded-circle border border-3 border-primary object-fit-cover" 
                   style="width: 120px; height: 120px;" alt="Avatar">
              <div class="mt-3 mx-auto" style="max-width: 400px;">
                <input type="text" class="form-control form-control-sm text-center" placeholder="Dán link ảnh (URL) vào đây để đổi Avatar" v-model="form.avatar">
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted small mb-1">Họ lót</label>
                <input type="text" class="form-control" v-model="form.hoLot" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted small mb-1">Tên</label>
                <input type="text" class="form-control" v-model="form.ten" required>
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
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted small mb-1">Số điện thoại</label>
                <input type="text" class="form-control" v-model="form.dienThoai">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted small mb-1">Địa chỉ</label>
                <input type="text" class="form-control" v-model="form.diaChi">
              </div>
            </div>

            <h6 class="text-muted fw-bold mt-4 mb-3 border-bottom pb-2">Thông tin Đăng nhập</h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted small mb-1">Email</label>
                <input type="email" class="form-control" v-model="form.email" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label text-muted small mb-1">Đổi Mật khẩu (Bỏ trống nếu không đổi)</label>
                <!-- type="password" và autocomplete giúp trình duyệt tự động nhận diện bảo mật -->
                <input type="password" class="form-control" v-model="form.password" autocomplete="new-password" placeholder="Nhập mật khẩu mới...">
              </div>
            </div>

            <div class="text-center mt-4">
              <button type="submit" class="btn btn-primary px-5 fw-bold">Lưu Thay Đổi</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const form = ref({});

const taiDuLieuCaNhan = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/docgia/profile/me');
    form.value = res.data;
    // Chuyển đổi định dạng ngày tháng để hiển thị đúng trên thẻ input type="date"
    if (form.value.ngaySinh) {
      form.value.ngaySinh = form.value.ngaySinh.split('T')[0];
    }
    // Xóa rỗng password cũ để tránh vô tình gửi lại chuỗi đã mã hóa
    form.value.password = ''; 
  } catch (error) {
    alert('Lỗi tải dữ liệu cá nhân');
  }
};

const capNhatThongTin = async () => {
  try {
    await axios.put('http://localhost:3000/api/docgia/profile/me', form.value);
    alert('Cập nhật thông tin thành công!');
    // Cập nhật lại tên trên LocalStorage để Menu đổi tên lập tức
    const user = JSON.parse(localStorage.getItem('user'));
    user.ten = form.value.ten;
    user.avatar = form.value.avatar;
    localStorage.setItem('user', JSON.stringify(user));
    window.location.reload(); // Tải lại trang để áp dụng thay đổi
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra');
  }
};

onMounted(() => {
  taiDuLieuCaNhan();
});
</script>