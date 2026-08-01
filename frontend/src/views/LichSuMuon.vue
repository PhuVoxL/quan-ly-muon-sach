<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-10">
      <div class="card shadow-sm border-0">
        <div class="card-header bg-warning text-dark text-center py-3">
          <h4 class="mb-0 fw-bold">Lịch Sử Mượn Sách Của Tôi</h4>
        </div>
        <div class="card-body p-0">
          

          <div class="row mx-2 mt-3 mb-3">
            <div class="col-md-5">
              <input type="text" class="form-control border-warning shadow-sm" 
                     placeholder="Tìm theo Tên sách hoặc Trạng thái (Vd: Đang mượn)..." 
                     v-model="tuKhoa">
            </div>
          </div>


          
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th class="ps-4">Tên Sách</th>
                <th>Tác Giả</th>
                <th>Ngày Mượn</th>
                <!-- THÊM CỘT NGÀY TRẢ VÀO ĐÂY -->
                <th>Ngày Trả</th> 
                <th>Trạng Thái</th>
                <th class="text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="phieu in lichSuLocDuoc" :key="phieu._id">
                <td class="ps-4 fw-bold text-primary">{{ phieu.sachId?.tenSach || 'Sách đã bị xóa' }}</td>
                <td>{{ phieu.sachId?.tacGia }}</td>
                <td>{{ phieu.ngayMuon ? new Date(phieu.ngayMuon).toLocaleDateString('vi-VN') : '' }}</td>
                
                <!-- THÊM DỮ LIỆU NGÀY TRẢ VÀO ĐÂY -->
                <!-- Nếu phieu.ngayTra có dữ liệu thì format ngày tháng, nếu không thì in ra 3 dấu gạch ngang '---' -->
                <td>{{ phieu.ngayTra ? new Date(phieu.ngayTra).toLocaleDateString('vi-VN') : '---' }}</td>
                
                <td>
                  <span class="badge fs-6" :class="layMauTrangThai(phieu.trangThai)">
                    {{ phieu.trangThai }}
                  </span>
                </td>
                <td class="text-center">
                  <button v-if="phieu.trangThai === 'Đang mượn'" class="btn btn-sm btn-outline-danger fw-bold" @click="xinGiaHan(phieu._id)">
                    Xin Gia Hạn
                  </button>
                  <span v-else class="text-muted small fst-italic">Không khả dụng</span>
                </td>
              </tr>
              
              <tr v-if="lichSuLocDuoc.length === 0">
                <td colspan="6" class="text-center text-muted py-5"> <!-- Nhớ đổi colspan từ 5 thành 6 -->
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const lichSu = ref([]);

const tuKhoa = ref(''); // 2. Tạo biến lưu từ khóa tìm kiếm

// 3. Viết hàm tự động lọc dữ liệu
const lichSuLocDuoc = computed(() => {
  return lichSu.value.filter(phieu => {
    // Lấy tên sách (Nếu sách bị xóa thì gán bằng chuỗi rỗng để tránh lỗi)
    const tenSach = phieu.sachId?.tenSach || '';
    const trangThai = phieu.trangThai || '';
    
    // Đưa tất cả về chữ thường để tìm kiếm không phân biệt hoa/thường
    const tuKhoaLower = tuKhoa.value.toLowerCase();
    
    return tenSach.toLowerCase().includes(tuKhoaLower) || 
           trangThai.toLowerCase().includes(tuKhoaLower);
  });
});


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