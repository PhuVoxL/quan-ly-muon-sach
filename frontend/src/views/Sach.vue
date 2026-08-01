<template>
  <div>
    <h2 class="mb-4">Quản lý Sách</h2>
    
    <!-- Form nhập liệu -->
    <div class="card mb-4">
      <div class="card-header text-white" :class="idCanSua ? 'bg-warning' : 'bg-primary'">
        {{ idCanSua ? 'Cập nhật Sách' : 'Thêm Sách Mới' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="luuSach">
          <div class="row">
            <div class="col-md-3 mb-3">
              <input type="text" class="form-control" placeholder="Mã Sách" v-model="sachMoi.maSach" required>
            </div>
            <div class="col-md-5 mb-3">
              <input type="text" class="form-control" placeholder="Tên Sách" v-model="sachMoi.tenSach" required>
            </div>
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" placeholder="Tác giả" v-model="sachMoi.tacGia">
            </div>
            <div class="col-md-3 mb-3">
              <input type="number" class="form-control" placeholder="Đơn giá (VNĐ)" v-model="sachMoi.donGia" required>
            </div>
            <div class="col-md-8 mb-3">
              <input type="text" class="form-control" placeholder="Link ảnh bìa sách (URL)" v-model="sachMoi.hinhAnh">
            </div>
            <div class="col-md-3 mb-3">
              <input type="number" class="form-control" placeholder="Số quyển" v-model="sachMoi.soQuyen" required>
            </div>
            <div class="col-md-3 mb-3">
              <input type="number" class="form-control" placeholder="Năm Xuất Bản" v-model="sachMoi.namXuatBan">
            </div>
            <div class="col-md-3 mb-3">
              <!-- Menu thả xuống để chọn Nhà Xuất Bản -->
              <select class="form-select" v-model="sachMoi.nhaXuatBanId" required>
                <option value="" disabled>-- Chọn Nhà Xuất Bản --</option>
                <!-- Duyệt qua danh sách NXB lấy từ Backend -->
                <option v-for="nxb in danhSachNXB" :key="nxb._id" :value="nxb._id">
                  {{ nxb.tenNXB }}
                </option>
              </select>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn" :class="idCanSua ? 'btn-warning' : 'btn-primary'">
              {{ idCanSua ? 'Lưu Cập Nhật' : 'Thêm Mới' }}
            </button>
            <button type="button" class="btn btn-secondary" v-if="idCanSua" @click="huySua">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bảng hiển thị Sách -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Mã Sách</th>
          <th class="ps-3">Bìa Sách</th>
          <th>Tên Sách</th>
          <th>Tác Giả</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Nhà Xuất Bản</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sach in danhSachSach" :key="sach._id">
          <td>{{ sach.maSach }}</td>
          <td class="ps-3">
                <img :src="sach.hinhAnh || 'https://via.placeholder.com/50x70?text=No+Cover'" 
                     alt="Bìa sách" class="shadow-sm object-fit-cover" style="width: 50px; height: 70px;">
              </td>
          <td>{{ sach.tenSach }}</td>
          <td>{{ sach.tacGia }}</td>
          <td>{{ sach.donGia }}</td>
          <td>{{ sach.soQuyen }}</td>
          <!-- Nhờ lệnh populate ở Backend, sach.nhaXuatBanId giờ là một object chứa thông tin NXB -->
          <td>{{ sach.nhaXuatBanId?.tenNXB }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="chuanBiSua(sach)">Sửa</button>
            <button class="btn btn-danger btn-sm" @click="xoaSach(sach._id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const danhSachSach = ref([]);
const danhSachNXB = ref([]); // Biến chứa danh sách NXB cho thẻ select
const idCanSua = ref(null);
const sachMoi = ref({
  maSach: '', tenSach: '', donGia: '', soQuyen: '', namXuatBan: '', tacGia: '', nhaXuatBanId: ''
});

// Hàm gọi API lấy Sách
const layDanhSachSach = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/sach');
    danhSachSach.value = response.data;
  } catch (error) {
    console.error('Lỗi lấy sách:', error);
  }
};

// Hàm gọi API lấy Nhà Xuất Bản để đổ vào Select Box
const layDanhSachNXB = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/nhaxuatban');
    danhSachNXB.value = response.data;
  } catch (error) {
    console.error('Lỗi lấy NXB:', error);
  }
};

const xoaSach = async (id) => {
  if (confirm('Bạn có chắc muốn xóa cuốn sách này?')) {
    try {
      await axios.delete(`http://localhost:3000/api/sach/${id}`);
      layDanhSachSach();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  }
};

const chuanBiSua = (sach) => {
  // Vì sach.nhaXuatBanId đang là một object, ta chỉ lấy phần _id gán vào form
  sachMoi.value = {
    maSach: sach.maSach,
    tenSach: sach.tenSach,
    donGia: sach.donGia,
    soQuyen: sach.soQuyen,
    namXuatBan: sach.namXuatBan,
    tacGia: sach.tacGia,
    nhaXuatBanId: sach.nhaXuatBanId ? sach.nhaXuatBanId._id : ''
  };
  idCanSua.value = sach._id;
};

const huySua = () => {
  sachMoi.value = { maSach: '', tenSach: '', donGia: '', soQuyen: '', namXuatBan: '', tacGia: '', nhaXuatBanId: '' };
  idCanSua.value = null;
};

const luuSach = async () => {
  try {
    if (idCanSua.value) {
      await axios.put(`http://localhost:3000/api/sach/${idCanSua.value}`, sachMoi.value);
    } else {
      await axios.post('http://localhost:3000/api/sach', sachMoi.value);
    }
    huySua();
    layDanhSachSach();
  } catch (error) {
    alert('Có lỗi, có thể mã sách bị trùng!');
  }
};

// Khi mở trang, gọi luôn 2 hàm để lấy cả Sách và NXB
onMounted(() => {
  layDanhSachSach();
  layDanhSachNXB();
});
</script>