<template>
  <div>
    <h2 class="mb-4">Quản lý Nhà Xuất Bản</h2>
    
    <!-- Form thêm mới Nhà Xuất Bản -->
    <div class="card mb-4">
      <div class="card-header bg-success text-white">Thêm Nhà Xuất Bản Mới</div>
      <div class="card-body">
        <!-- @submit.prevent giúp ngăn trình duyệt tải lại trang khi bấm nút Submit -->
        <form @submit.prevent="themNXB">
          <div class="row">
            <div class="col-md-3 mb-3">
              <!-- v-model giúp đồng bộ dữ liệu người dùng gõ vào với biến nxbMoi ở script -->
              <input type="text" class="form-control" placeholder="Mã NXB (Vd: NXB002)" v-model="nxbMoi.maNXB" required>
            </div>
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" placeholder="Tên Nhà Xuất Bản" v-model="nxbMoi.tenNXB" required>
            </div>
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Địa chỉ" v-model="nxbMoi.diaChi" required>
            </div>
            <div class="col-md-2 mb-3">
              <button type="submit" class="btn btn-success w-100">Thêm Mới</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Bảng hiển thị dữ liệu -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Mã NXB</th>
          <th>Tên Nhà Xuất Bản</th>
          <th>Địa Chỉ</th>
        </tr>
      </thead>
      <tbody>
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

const danhSachNXB = ref([]);

// Tạo một biến chứa dữ liệu trống để hứng dữ liệu từ Form nhập vào
const nxbMoi = ref({
  maNXB: '',
  tenNXB: '',
  diaChi: ''
});

// Hàm lấy danh sách
const layDanhSach = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/nhaxuatban');
    danhSachNXB.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhà xuất bản:', error);
  }
};

// Hàm thêm mới
const themNXB = async () => {
  try {
    // Gửi yêu cầu POST kèm theo dữ liệu người dùng nhập (nxbMoi.value) xuống Backend
    await axios.post('http://localhost:3000/api/nhaxuatban', nxbMoi.value);
    
    // Nếu thành công, làm sạch các ô nhập liệu
    nxbMoi.value = { maNXB: '', tenNXB: '', diaChi: '' };
    
    // Gọi lại hàm layDanhSach để bảng tự động cập nhật hiển thị dòng mới
    layDanhSach();
  } catch (error) {
    alert('Có lỗi xảy ra, có thể mã NXB đã bị trùng!');
    console.error('Lỗi khi thêm mới:', error);
  }
};

onMounted(() => {
  layDanhSach();
});
</script>