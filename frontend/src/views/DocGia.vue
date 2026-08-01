
<template>
  <div>
    <h2 class="mb-4">Quản lý Độc Giả</h2>
    
    <!-- Form nhập liệu Độc Giả -->
    <div class="card mb-4">
      <div class="card-header text-white" :class="idCanSua ? 'bg-warning' : 'bg-success'">
        {{ idCanSua ? 'Cập nhật Thông tin Độc Giả' : 'Thêm Độc Giả Mới' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="luuDocGia">
          <div class="row">
            <div class="col-md-2 mb-3">
              <input type="text" class="form-control" placeholder="Mã ĐG" v-model="docGiaMoi.maDocGia" required>
            </div>
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Họ lót" v-model="docGiaMoi.hoLot">
            </div>
            <div class="col-md-2 mb-3">
              <input type="text" class="form-control" placeholder="Tên" v-model="docGiaMoi.ten" required>
            </div>
            <div class="col-md-3 mb-3">
              <!-- Ô chọn ngày tháng -->
              <input type="date" class="form-control" v-model="docGiaMoi.ngaySinh">
            </div>
            <div class="col-md-2 mb-3">
              <select class="form-select" v-model="docGiaMoi.phai">
                <option value="" disabled>-- Phái --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <input type="text" class="form-control" placeholder="Địa chỉ" v-model="docGiaMoi.diaChi">
            </div>
            <div class="col-md-6 mb-3">
              <input type="text" class="form-control" placeholder="Số điện thoại" v-model="docGiaMoi.dienThoai">
            </div>
            <div class="col-md-12 mb-3">
              <input type="text" class="form-control" placeholder="Link ảnh Avatar (URL)" v-model="docGiaMoi.avatar">
            </div>
            <div class="col-md-6 mb-3">
              <input type="email" class="form-control" placeholder="Email đăng nhập" v-model="docGiaMoi.email">
            </div>
            <div class="col-md-6 mb-3">
              <input type="password" class="form-control" placeholder="Đặt lại mật khẩu mới..." v-model="docGiaMoi.password" autocomplete="new-password">
            </div>

          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn" :class="idCanSua ? 'btn-warning' : 'btn-success'">
              {{ idCanSua ? 'Lưu Cập Nhật' : 'Thêm Mới' }}
            </button>
            <button type="button" class="btn btn-secondary" v-if="idCanSua" @click="huySua">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-md-4">
        <input type="text" class="form-control border-primary" placeholder="Tìm kiếm theo Tên hoặc Mã ĐG..." v-model="tuKhoa">
      </div>
    </div>

    <!-- Bảng hiển thị Độc Giả -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Mã ĐG</th>
          <th>Họ Tên</th>
          <th>Ngày Sinh</th>
          <th>Phái</th>
          <th>SĐT</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
  <!-- Sửa 'docGia' thành 'dg' ở dòng này -->
  <tr v-for="dg in danhSachLocDuoc" :key="dg._id">
    <td>{{ dg.maDocGia }}</td>
    <!-- Nối họ lót và tên lại để hiển thị cho gọn -->
    <td>{{ dg.hoLot }} {{ dg.ten }}</td>
    <!-- Chuyển đổi định dạng ngày cho dễ nhìn -->
    <td>{{ dg.ngaySinh ? new Date(dg.ngaySinh).toLocaleDateString('vi-VN') : '' }}</td>
    <td>{{ dg.phai }}</td>
    <td>{{ dg.dienThoai }}</td>
    <td>
      <button class="btn btn-warning btn-sm me-2" @click="chuanBiSua(dg)">Sửa</button>
      <button class="btn btn-danger btn-sm" @click="xoaDocGia(dg._id)">Xóa</button>
    </td>
  </tr>
</tbody>
    </table>
  </div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue'; 
import axios from 'axios';

const danhSachDocGia = ref([]);
const tuKhoa = ref(''); // Biến lưu từ khóa tìm kiếm

// Tạo ra một danh sách mới, tự động thay đổi mỗi khi tuKhoa thay đổi
const danhSachLocDuoc = computed(() => {
  return danhSachDocGia.value.filter(dg => 
    (dg.ten && dg.ten.toLowerCase().includes(tuKhoa.value.toLowerCase())) ||
    (dg.maDocGia && dg.maDocGia.toLowerCase().includes(tuKhoa.value.toLowerCase())) ||
    (dg.dienThoai && dg.dienThoai.toLowerCase().includes(tuKhoa.value.toLowerCase())) 
  );
});


const idCanSua = ref(null);
const docGiaMoi = ref({
  maDocGia: '', hoLot: '', ten: '', ngaySinh: '', phai: '', diaChi: '', dienThoai: ''
});

const layDanhSachDocGia = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/docgia');
    danhSachDocGia.value = response.data;
  } catch (error) {
    console.error('Lỗi lấy độc giả:', error);
  }
};

const xoaDocGia = async (id) => {
  if (confirm('Bạn có chắc muốn xóa độc giả này?')) {
    try {
      await axios.delete(`http://localhost:3000/api/docgia/${id}`);
      layDanhSachDocGia();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  }
};

const chuanBiSua = (dg) => {
  // Cắt phần ngày tháng (YYYY-MM-DD) từ chuỗi thời gian để đưa vào thẻ input type="date"
  const ngaySinhFormatted = dg.ngaySinh ? dg.ngaySinh.split('T')[0] : '';
  
  docGiaMoi.value = {
    maDocGia: dg.maDocGia,
    hoLot: dg.hoLot,
    ten: dg.ten,
    ngaySinh: ngaySinhFormatted,
    phai: dg.phai,
    diaChi: dg.diaChi,
    dienThoai: dg.dienThoai,
    password: '', // Không hiển thị mật khẩu cũ, để trống nếu không đổi
  };
  
  idCanSua.value = dg._id;
};

const huySua = () => {
  docGiaMoi.value = { maDocGia: '', hoLot: '', ten: '', ngaySinh: '', phai: '', diaChi: '', dienThoai: '' };
  idCanSua.value = null;
};

const luuDocGia = async () => {
  try {
    if (idCanSua.value) {
      await axios.put(`http://localhost:3000/api/docgia/${idCanSua.value}`, docGiaMoi.value);
    } else {
      await axios.post('http://localhost:3000/api/docgia', docGiaMoi.value);
    }
    huySua();
    layDanhSachDocGia();
  } catch (error) {
    alert('Có lỗi, kiểm tra lại mã độc giả có thể bị trùng!');
  }
};

onMounted(() => {
  layDanhSachDocGia();
});
</script>