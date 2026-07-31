<template>
  <div>
    <h2 class="mb-4">Quản lý Mượn Trả Sách</h2>
    
    <div class="card mb-4">
      <div class="card-header text-white" :class="idCanSua ? 'bg-warning' : 'bg-info text-dark'">
        {{ idCanSua ? 'Cập nhật Phiếu Mượn' : 'Tạo Phiếu Mượn Mới' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="luuPhieu">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label text-muted small">Người mượn</label>
              <select class="form-select" v-model="phieuMoi.docGiaId" required>
                <option value="" disabled>-- Chọn Độc Giả --</option>
                <option v-for="dg in danhSachDocGia" :key="dg._id" :value="dg._id">
                  {{ dg.hoLot }} {{ dg.ten }} ({{ dg.maDocGia }})
                </option>
              </select>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label text-muted small">Cuốn sách</label>
              <select class="form-select" v-model="phieuMoi.sachId" required>
                <option value="" disabled>-- Chọn Sách --</option>
                <option v-for="sach in danhSachSach" :key="sach._id" :value="sach._id">
                  {{ sach.tenSach }}
                </option>
              </select>
            </div>
            <div class="col-md-2 mb-3">
              <label class="form-label text-muted small">Ngày mượn</label>
              <input type="date" class="form-control" v-model="phieuMoi.ngayMuon" required>
            </div>
            <div class="col-md-2 mb-3">
              <label class="form-label text-muted small">Ngày trả</label>
              <input type="date" class="form-control" v-model="phieuMoi.ngayTra">
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn" :class="idCanSua ? 'btn-warning' : 'btn-info'">
              {{ idCanSua ? 'Lưu Cập Nhật' : 'Tạo Phiếu' }}
            </button>
            <button type="button" class="btn btn-secondary" v-if="idCanSua" @click="huySua">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Tên Độc Giả</th>
          <th>Tên Sách</th>
          <th>Ngày Mượn</th>
          <th>Ngày Trả</th>
          <th>Trạng Thái</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="phieu in danhSachPhieu" :key="phieu._id">
          <!-- Sử dụng ?. để tránh lỗi nếu độc giả hoặc sách đã bị xóa khỏi hệ thống -->
          <td>{{ phieu.docGiaId?.hoLot }} {{ phieu.docGiaId?.ten }}</td>
          <td>{{ phieu.sachId?.tenSach }}</td>
          <td>{{ phieu.ngayMuon ? new Date(phieu.ngayMuon).toLocaleDateString('vi-VN') : '' }}</td>
          <td>{{ phieu.ngayTra ? new Date(phieu.ngayTra).toLocaleDateString('vi-VN') : '' }}</td>
          <td>
            <span class="badge" :class="phieu.ngayTra ? 'bg-success' : 'bg-danger'">
              {{ phieu.ngayTra ? 'Đã trả' : 'Đang mượn' }}
            </span>
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="chuanBiSua(phieu)">Sửa</button>
            <button class="btn btn-danger btn-sm" @click="xoaPhieu(phieu._id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const danhSachPhieu = ref([]);
const danhSachDocGia = ref([]);
const danhSachSach = ref([]);
const idCanSua = ref(null);

const phieuMoi = ref({
  docGiaId: '', sachId: '', ngayMuon: '', ngayTra: ''
});

// Lấy dữ liệu từ cả 3 bảng để hiển thị
const taiDuLieu = async () => {
  try {
    const [resPhieu, resDocGia, resSach] = await Promise.all([
      axios.get('http://localhost:3000/api/theodoimuonsach'),
      axios.get('http://localhost:3000/api/docgia'),
      axios.get('http://localhost:3000/api/sach')
    ]);
    danhSachPhieu.value = resPhieu.data;
    danhSachDocGia.value = resDocGia.data;
    danhSachSach.value = resSach.data;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  }
};

const xoaPhieu = async (id) => {
  if (confirm('Xóa phiếu mượn này?')) {
    try {
      await axios.delete(`http://localhost:3000/api/theodoimuonsach/${id}`);
      taiDuLieu();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  }
};

const chuanBiSua = (phieu) => {
  const ngayMuonFormat = phieu.ngayMuon ? phieu.ngayMuon.split('T')[0] : '';
  const ngayTraFormat = phieu.ngayTra ? phieu.ngayTra.split('T')[0] : '';
  
  phieuMoi.value = {
    docGiaId: phieu.docGiaId?._id || '',
    sachId: phieu.sachId?._id || '',
    ngayMuon: ngayMuonFormat,
    ngayTra: ngayTraFormat
  };
  idCanSua.value = phieu._id;
};

const huySua = () => {
  phieuMoi.value = { docGiaId: '', sachId: '', ngayMuon: '', ngayTra: '' };
  idCanSua.value = null;
};

const luuPhieu = async () => {
  try {
    if (idCanSua.value) {
      await axios.put(`http://localhost:3000/api/theodoimuonsach/${idCanSua.value}`, phieuMoi.value);
    } else {
      await axios.post('http://localhost:3000/api/theodoimuonsach', phieuMoi.value);
    }
    huySua();
    taiDuLieu();
  } catch (error) {
    alert('Có lỗi xảy ra!');
  }
};

onMounted(() => {
  taiDuLieu();
});
</script>