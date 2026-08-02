<template>
  <div>
    <h2 class="mb-4 fw-bold text-primary">Quản lý Yêu Cầu & Mượn Trả</h2>
    
    <!-- Form Xử lý (Chỉ hiện khi bấm Sửa/Duyệt) -->
    <div class="card mb-4 shadow-sm" v-if="idCanSua">
      <div class="card-header bg-warning text-dark fw-bold">
        Xử lý Phiếu Mượn
      </div>
      <div class="card-body">
        <form @submit.prevent="luuPhieu">
          <div class="row align-items-end">
            <div class="col-md-3 mb-3">
              <label class="form-label text-muted small">Cập nhật Trạng thái</label>
              <select class="form-select border-warning fw-bold" v-model="phieuMoi.trangThai" required>
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Đang mượn">Đồng ý cho mượn (Đang mượn)</option>
                <option value="Yêu cầu gia hạn">Đang xin gia hạn</option>
                <option value="Từ chối">Từ chối cho mượn</option>
                <option value="Đã trả">Đã nhận lại sách (Đã trả)</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label text-muted small">Ngày trả (Nếu có)</label>
              <input type="date" class="form-control" v-model="phieuMoi.ngayTra">
            </div>
            <div class="col-md-6 mb-3 d-flex gap-2">
              <button type="submit" class="btn btn-warning fw-bold px-4">Lưu Cập Nhật</button>
              <button type="button" class="btn btn-secondary" @click="huySua">Hủy bỏ</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-md-4">
        <input type="text" class="form-control border-primary" placeholder="Tìm kiếm theo Tên Độc Giả hoặc Tên ĐG..." v-model="tuKhoa">
      </div>
    </div>


    <!-- Bảng danh sách tất cả phiếu mượn -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <table class="table table-hover table-striped mb-0 align-middle">
          <thead class="table-dark">
            <tr>
              <th class="ps-3">Độc Giả</th>
              <th>Cuốn Sách</th>
              <th>Ngày Mượn</th>
              <th>Ngày Trả</th>
              <th>Trạng Thái</th>
              <th class="text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="phieu in danhSachLocDuoc" :key="phieu._id">
              <td class="ps-3 fw-bold">{{ phieu.docGiaId?.hoLot }} {{ phieu.docGiaId?.ten }}</td>
              <td class="text-primary">{{ phieu.sachId?.tenSach }}</td>
              <td>{{ phieu.ngayMuon ? new Date(phieu.ngayMuon).toLocaleDateString('vi-VN') : '' }}</td>
              <td>{{ phieu.ngayTra ? new Date(phieu.ngayTra).toLocaleDateString('vi-VN') : '---' }}</td>
              <td>
                <span class="badge fs-6" :class="layMauTrangThai(phieu.trangThai)">
                  {{ phieu.trangThai }}
                </span>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-primary fw-bold me-2" @click="chuanBiSua(phieu)">Xử lý</button>
                <button class="btn btn-sm btn-outline-danger" @click="xoaPhieu(phieu._id)">Xóa</button>
              </td>
            </tr>
            <tr v-if="danhSachPhieu.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">Hệ thống chưa có giao dịch nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const danhSachPhieu = ref([]);
const idCanSua = ref(null);
const tuKhoa = ref('');

const danhSachLocDuoc = computed(() => {
  return danhSachPhieu.value.filter(phieu => 
    (phieu.docGiaId?.hoLot && phieu.docGiaId.hoLot.toLowerCase().includes(tuKhoa.value.toLowerCase())) ||
    (phieu.docGiaId?.ten && phieu.docGiaId.ten.toLowerCase().includes(tuKhoa.value.toLowerCase())) ||
    (phieu.sachId?.tenSach && phieu.sachId.tenSach.toLowerCase().includes(tuKhoa.value.toLowerCase())) ||
    (phieu.trangThai && phieu.trangThai.toLowerCase().includes(tuKhoa.value.toLowerCase()))
  );
});

// Lấy thêm trường trangThai vào form
const phieuMoi = ref({ ngayTra: '', trangThai: '' });

const taiDuLieu = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/theodoimuonsach');
    danhSachPhieu.value = res.data;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu phiếu mượn:', error);
  }
};

const layMauTrangThai = (trangThai) => {
  switch (trangThai) {
    case 'Chờ duyệt': return 'bg-secondary';
    case 'Đang mượn': return 'bg-info text-dark';
    case 'Yêu cầu gia hạn': return 'bg-warning text-dark';
    case 'Đã trả': return 'bg-success';
    case 'Từ chối': return 'bg-danger';
    default: return 'bg-dark';
  }
};

const xoaPhieu = async (id) => {
  if (confirm('Lưu ý: Nếu xóa phiếu đang mượn, sách sẽ được tự động hoàn lại vào kho. Tiếp tục xóa?')) {
    try {
      await axios.delete(`http://localhost:3000/api/theodoimuonsach/${id}`);
      taiDuLieu();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  }
};

const chuanBiSua = (phieu) => {
  const ngayTraFormat = phieu.ngayTra ? phieu.ngayTra.split('T')[0] : '';
  phieuMoi.value = {
    ngayTra: ngayTraFormat,
    trangThai: phieu.trangThai || 'Chờ duyệt'
  };
  idCanSua.value = phieu._id;
};

const huySua = () => {
  phieuMoi.value = { ngayTra: '', trangThai: '' };
  idCanSua.value = null;
};

const luuPhieu = async () => {
  try {
    // Gọi API PUT để cập nhật trạng thái mới
    await axios.put(`http://localhost:3000/api/theodoimuonsach/${idCanSua.value}`, phieuMoi.value);
    huySua();
    taiDuLieu();
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

onMounted(() => {
  taiDuLieu();
});
</script>