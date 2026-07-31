<template>
  <div>
    <h2 class="mb-4">Quản lý Nhân Viên</h2>
    
    <div class="card mb-4">
      <div class="card-header text-white" :class="idCanSua ? 'bg-warning' : 'bg-secondary'">
        {{ idCanSua ? 'Cập nhật Nhân Viên' : 'Thêm Nhân Viên Mới' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="luuNhanVien">
          <div class="row">
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Mã Số NV" v-model="nhanVienMoi.msnv" required>
            </div>
            <div class="col-md-5 mb-3">
              <input type="text" class="form-control" placeholder="Họ Tên Nhân Viên" v-model="nhanVienMoi.hoTenNV" required>
            </div>
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" placeholder="Chức vụ" v-model="nhanVienMoi.chucVu">
            </div>
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" placeholder="Số điện thoại" v-model="nhanVienMoi.soDienThoai">
            </div>
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" placeholder="Địa chỉ" v-model="nhanVienMoi.diaChi">
            </div>
            <div class="col-md-4 mb-3">
              <!-- Mật khẩu tạm thời để dạng text hoặc password tùy bạn, ở đây dùng text để dễ nhìn khi test -->
              <input type="text" class="form-control" placeholder="Mật khẩu đăng nhập" v-model="nhanVienMoi.password" required>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn" :class="idCanSua ? 'btn-warning' : 'btn-secondary'">
              {{ idCanSua ? 'Lưu Cập Nhật' : 'Thêm Mới' }}
            </button>
            <button type="button" class="btn btn-light border" v-if="idCanSua" @click="huySua">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Mã NV</th>
          <th>Họ Tên</th>
          <th>Chức vụ</th>
          <th>Số Điện Thoại</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nv in danhSachNhanVien" :key="nv._id">
          <td>{{ nv.msnv }}</td>
          <td>{{ nv.hoTenNV }}</td>
          <td>{{ nv.chucVu }}</td>
          <td>{{ nv.soDienThoai }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="chuanBiSua(nv)">Sửa</button>
            <button class="btn btn-danger btn-sm" @click="xoaNhanVien(nv._id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const danhSachNhanVien = ref([]);
const idCanSua = ref(null);
const nhanVienMoi = ref({
  msnv: '', hoTenNV: '', password: '', chucVu: '', diaChi: '', soDienThoai: ''
});

const layDanhSachNhanVien = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/nhanvien');
    danhSachNhanVien.value = response.data;
  } catch (error) {
    console.error('Lỗi lấy nhân viên:', error);
  }
};

const xoaNhanVien = async (id) => {
  if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
    try {
      await axios.delete(`http://localhost:3000/api/nhanvien/${id}`);
      layDanhSachNhanVien();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  }
};

const chuanBiSua = (nv) => {
  nhanVienMoi.value = {
    msnv: nv.msnv,
    hoTenNV: nv.hoTenNV,
    password: nv.password,
    chucVu: nv.chucVu,
    diaChi: nv.diaChi,
    soDienThoai: nv.soDienThoai
  };
  idCanSua.value = nv._id;
};

const huySua = () => {
  nhanVienMoi.value = { msnv: '', hoTenNV: '', password: '', chucVu: '', diaChi: '', soDienThoai: '' };
  idCanSua.value = null;
};

const luuNhanVien = async () => {
  try {
    if (idCanSua.value) {
      await axios.put(`http://localhost:3000/api/nhanvien/${idCanSua.value}`, nhanVienMoi.value);
    } else {
      await axios.post('http://localhost:3000/api/nhanvien', nhanVienMoi.value);
    }
    huySua();
    layDanhSachNhanVien();
  } catch (error) {
    alert('Có lỗi, kiểm tra lại mã nhân viên có thể bị trùng!');
  }
};

onMounted(() => {
  layDanhSachNhanVien();
});
</script>