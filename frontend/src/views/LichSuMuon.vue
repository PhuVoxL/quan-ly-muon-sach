<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-10">
      <div class="card shadow-sm border-0">
        <div class="card-header bg-warning text-dark text-center py-3">
          <h4 class="mb-0 fw-bold">Lịch Sử Mượn Sách Của Tôi</h4>
        </div>
        <div class="card-body p-0">
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th class="ps-4">Tên Sách</th>
                <th>Tác Giả</th>
                <th>Ngày Mượn</th>
                <th>Trạng Thái</th>
                <th class="text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="phieu in lichSu" :key="phieu._id">
                <td class="ps-4 fw-bold text-primary">{{ phieu.sachId?.tenSach || 'Sách đã bị xóa' }}</td>
                <td>{{ phieu.sachId?.tacGia }}</td>
                <td>{{ new Date(phieu.ngayMuon).toLocaleDateString('vi-VN') }}</td>
                <td>
                  <!-- Hiển thị màu sắc huy hiệu tùy theo trạng thái -->
                  <span class="badge fs-6" :class="layMauTrangThai(phieu.trangThai)">
                    {{ phieu.trangThai }}
                  </span>
                </td>
                <td class="text-center">
                  <!-- Chỉ hiện nút Gia hạn khi sách đang ở trạng thái Đang mượn -->
                  <button v-if="phieu.trangThai === 'Đang mượn'" class="btn btn-sm btn-outline-danger fw-bold" @click="xinGiaHan(phieu._id)">
                    Xin Gia Hạn
                  </button>
                  <span v-else class="text-muted small fst-italic">Không khả dụng</span>
                </td>
              </tr>
              
              <!-- Hiển thị khi mảng lịch sử trống -->
              <tr v-if="lichSu.length === 0">
                <td colspan="5" class="text-center text-muted py-5">
                  <h5>Bạn chưa có giao dịch mượn sách nào.</h5>
                  <router-link to="/timsach" class="btn btn-primary mt-2">Khám phá sách ngay</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const lichSu = ref([]);

// Hàm tải dữ liệu lịch sử từ API (đã được cấu hình tự động gửi Token ở main.js)
const taiLichSu = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/theodoimuonsach/lich-su');
    lichSu.value = res.data;
  } catch (error) {
    console.error('Lỗi khi tải lịch sử:', error);
  }
};

// Hàm quy định màu sắc cho từng trạng thái
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

// Hàm gọi API xin gia hạn sách
const xinGiaHan = async (idPhieu) => {
  if (confirm('Bạn muốn gửi yêu cầu gia hạn cho cuốn sách này?')) {
    try {
      const res = await axios.put(`http://localhost:3000/api/theodoimuonsach/gia-han/${idPhieu}`);
      alert(res.data.message);
      taiLichSu(); // Tải lại bảng để cập nhật trạng thái mới
    } catch (error) {
      alert('Có lỗi xảy ra khi xin gia hạn!');
    }
  }
};

onMounted(() => {
  taiLichSu();
});
</script>