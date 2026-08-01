<template>
  <div>
    <h2 class="mb-4">Quản lý Nhà Xuất Bản</h2>
    
    <!-- Form nhập liệu (Dùng chung cho cả Thêm và Sửa) -->
    <div class="card mb-4">
      <!-- Thay đổi màu và tiêu đề dựa vào việc có đang sửa hay không -->
      <div class="card-header text-white" :class="idCanSua ? 'bg-warning' : 'bg-primary'">
        {{ idCanSua ? 'Cập nhật Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản Mới' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="luuNXB">
          <div class="row">
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Mã NXB" v-model="nxbMoi.maNXB" required>
            </div>
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Tên Nhà Xuất Bản" v-model="nxbMoi.tenNXB" required>
            </div>
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Địa chỉ" v-model="nxbMoi.diaChi" required>
            </div>
            <div class="col-md-3 mb-3 d-flex gap-2">
              <!-- Đổi chữ trên nút bấm tương ứng -->
              <button type="submit" class="btn w-100" :class="idCanSua ? 'btn-warning' : 'btn-primary'">
                {{ idCanSua ? 'Lưu Cập Nhật' : 'Thêm' }}
              </button>
              <!-- Nút Hủy chỉ hiện ra khi đang ở chế độ sửa -->
              <button type="button" class="btn btn-secondary w-100" v-if="idCanSua" @click="huySua">Hủy</button>
            </div>
          </div>
        </form>
      </div>
    </div>


    <div class="row mb-3">
      <div class="col-md-4">
        <input type="text" class="form-control border-primary" placeholder="Tìm kiếm theo Tên NXB hoặc Mã NXB..." v-model="tuKhoa">
      </div>
    </div>

    <!-- Bảng hiển thị -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Mã NXB</th>
          <th>Tên Nhà Xuất Bản</th>
          <th>Địa Chỉ</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nxb in danhSachLocDuoc" :key="nxb._id">
          <td>{{ nxb.maNXB }}</td>
          <td>{{ nxb.tenNXB }}</td>
          <td>{{ nxb.diaChi }}</td>
          <td>
            <!-- Nút Sửa nằm cạnh nút Xóa -->
            <button class="btn btn-warning btn-sm me-2" @click="chuanBiSua(nxb)">Sửa</button>
            <button class="btn btn-danger btn-sm" @click="xoaNXB(nxb._id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const danhSachNXB = ref([]);
const tuKhoa = ref(''); // Biến lưu từ khóa tìm kiếm

// Tạo ra một danh sách mới, tự động thay đổi mỗi khi tuKhoa thay đổi
const danhSachLocDuoc = computed(() => {
  return danhSachNXB.value.filter(nxb => 
    (nxb.tenNXB && nxb.tenNXB.toLowerCase().includes(tuKhoa.value.toLowerCase())) ||
    (nxb.maNXB && nxb.maNXB.toLowerCase().includes(tuKhoa.value.toLowerCase())) ||
    (nxb.diaChi && nxb.diaChi.toLowerCase().includes(tuKhoa.value.toLowerCase()))
  );
});



const nxbMoi = ref({ maNXB: '', tenNXB: '', diaChi: '' });
// Biến lưu trữ ID của dòng đang được bấm sửa (Nếu null nghĩa là đang ở chế độ Thêm mới)
const idCanSua = ref(null); 

const layDanhSach = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/nhaxuatban');
    danhSachNXB.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhà xuất bản:', error);
  }
};

const xoaNXB = async (id) => {
  const xacNhan = confirm('Bạn có chắc chắn muốn xóa Nhà xuất bản này không?');
  if (xacNhan) {
    try {
      await axios.delete(`http://localhost:3000/api/nhaxuatban/${id}`);
      layDanhSach();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Không thể xóa Nhà xuất bản này!');
    }
  }
};

// Hàm lấy dữ liệu từ bảng đưa ngược lên Form để chuẩn bị sửa
const chuanBiSua = (nxb) => {
  nxbMoi.value = { maNXB: nxb.maNXB, tenNXB: nxb.tenNXB, diaChi: nxb.diaChi };
  idCanSua.value = nxb._id;
};

// Hàm hủy chế độ sửa, trả form về trạng thái trống
const huySua = () => {
  nxbMoi.value = { maNXB: '', tenNXB: '', diaChi: '' };
  idCanSua.value = null;
};

// Hàm Gộp chung xử lý Thêm Mới và Cập Nhật
const luuNXB = async () => {
  try {
    if (idCanSua.value) {
      // Nếu biến idCanSua có giá trị -> Gọi API PUT để Cập nhật
      await axios.put(`http://localhost:3000/api/nhaxuatban/${idCanSua.value}`, nxbMoi.value);
    } else {
      // Nếu biến idCanSua là null -> Gọi API POST để Thêm mới
      await axios.post('http://localhost:3000/api/nhaxuatban', nxbMoi.value);
    }
    
    // Thành công thì làm trống form và tải lại bảng
    huySua(); 
    layDanhSach(); 
  } catch (error) {
    console.error('Lỗi khi lưu:', error);
    alert('Có lỗi xảy ra, vui lòng kiểm tra lại thông tin!');
  }
};

onMounted(() => {
  layDanhSach();
});
</script>