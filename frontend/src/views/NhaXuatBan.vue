<template>
  <div>
    <h2 class="mb-4">Quản lý Nhà Xuất Bản</h2>
    
    <!-- Bảng hiển thị dữ liệu bằng Bootstrap -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Mã NXB</th>
          <th>Tên Nhà Xuất Bản</th>
          <th>Địa Chỉ</th>
        </tr>
      </thead>
      <tbody>
        <!-- Vòng lặp v-for sẽ duyệt qua từng dòng dữ liệu lấy được từ Backend -->
        <tr v-for="nxb in danhSachNXB" :key="nxb._id">
          <td>{{ nxb.maNXB }}</td>
          <td>{{ nxb.tenNXB }}</td>
          <td>{{ nxb.diaChi }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Tạo một biến rỗng để chứa dữ liệu từ Backend gửi về
const danhSachNXB = ref([]);

// Hàm gọi API lấy danh sách
const layDanhSach = async () => {
  try {
    // Gọi phương thức GET tới địa chỉ API của Backend
    const response = await axios.get('http://localhost:3000/api/nhaxuatban');
    // Gán dữ liệu nhận được vào biến
    danhSachNXB.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhà xuất bản:', error);
  }
};

// Vừa mở trang web lên là tự động chạy hàm lấy dữ liệu
onMounted(() => {
  layDanhSach();
});
</script>