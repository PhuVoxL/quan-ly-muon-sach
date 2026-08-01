<template>
  <div class="row mt-4" v-if="sach">
    <!-- Cột Trái: Thông tin sách và nút mượn -->
    <div class="col-md-5 mb-4">
      <div class="card shadow-sm border-0 h-100">

        <div class="card-body text-center p-5 bg-light d-flex flex-column justify-content-center">
          <img :src="sach.hinhAnh || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'" 
               class="img-fluid rounded mb-4 shadow" style="max-height: 350px; object-fit: cover;" alt="Bìa sách">

          <h2 class="text-primary fw-bold mb-4">{{ sach.tenSach }}</h2>
          <p class="fs-5 mb-2"><strong>Tác giả:</strong> {{ sach.tacGia }}</p>
          <p class="fs-5 mb-2"><strong>Năm xuất bản:</strong> {{ sach.namXuatBan || 'Chưa rõ' }}</p>
          <p class="fs-5 mb-2"><strong>Đơn giá:</strong> {{ sach.donGia?.toLocaleString('vi-VN') }} VNĐ</p>
          
          <div class="mt-4" v-if="isDocGia">
            <!-- Nút gửi yêu cầu (Vô hiệu hóa nếu hết sách) -->
            <button class="btn btn-success btn-lg w-100 shadow" :disabled="sach.soQuyen <= 0" @click="guiYeuCauMuon">
              {{ sach.soQuyen > 0 ? 'Gửi Yêu Cầu Mượn' : 'Sách Tạm Hết' }}
            </button>
            <small class="text-muted d-block mt-2">Sách sẽ được thêm vào mục Lịch Sử Mượn ở trạng thái "Chờ duyệt"</small>
          </div>
          <div class="mt-4 alert alert-warning fw-bold" v-else-if="!isLoggedIn">
            Vui lòng <router-link to="/dangnhap">Đăng nhập tài khoản Độc giả</router-link> để mượn sách.
          </div>
        </div>
      </div>
    </div>

    <!-- Cột Phải: Đánh giá & Bình luận -->
    <div class="col-md-7">
      <div class="card shadow-sm border-0 h-100">
        <div class="card-header bg-white fw-bold fs-5 text-primary py-3">Bình Luận & Đánh Giá</div>
        <div class="card-body">
          
          <!-- Form gửi bình luận (Chỉ hiện khi đã đăng nhập bất kỳ tài khoản nào) -->
          <form class="mb-4" v-if="isLoggedIn" @submit.prevent="guiBinhLuan">
            <div class="d-flex gap-2 mb-2">
              <select class="form-select w-25 border-primary" v-model="binhLuanMoi.diemDanhGia" required>
                <option value="5">5 ⭐⭐⭐⭐⭐</option>
                <option value="4">4 ⭐⭐⭐⭐</option>
                <option value="3">3 ⭐⭐⭐</option>
                <option value="2">2 ⭐⭐</option>
                <option value="1">1 ⭐</option>
              </select>
              <input type="text" class="form-control w-75 border-primary" placeholder="Chia sẻ cảm nghĩ của bạn..." v-model="binhLuanMoi.noiDung" required>
              <button type="submit" class="btn btn-primary fw-bold px-4">Gửi</button>
            </div>
          </form>

          <!-- Danh sách các bình luận -->
          <div v-if="danhSachBinhLuan.length === 0" class="text-muted fst-italic text-center mt-5">
            Chưa có đánh giá nào cho cuốn sách này.
          </div>
          
          <div class="list-group list-group-flush" style="max-height: 400px; overflow-y: auto;">
            <div class="list-group-item px-0 py-3" v-for="bl in danhSachBinhLuan" :key="bl._id">
              <!-- Thẻ cha dàn đều 2 bên -->
              <div class="d-flex justify-content-between mb-2">
                
                <!-- BẮT ĐẦU NHÓM BÊN TRÁI (Avatar + Tên) -->
                <div class="d-flex align-items-center gap-2">
                  <img :src="bl.docGiaId?.avatar || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'" 
                       class="rounded-circle object-fit-cover border" style="width: 35px; height: 35px;" alt="Avatar">
                  <strong class="text-dark">{{ bl.docGiaId?.hoLot }} {{ bl.docGiaId?.ten || 'Người dùng' }}</strong>
                </div>
                <!-- KẾT THÚC NHÓM BÊN TRÁI -->

                <!-- BÊN PHẢI (Số sao) -->
                <span class="text-warning fw-bold fs-5">{{ bl.diemDanhGia }} ⭐</span>
              </div>
              
              <p class="mb-1 text-secondary ms-5">{{ bl.noiDung }}</p>
              <small class="text-muted ms-5">{{ new Date(bl.createdAt).toLocaleDateString('vi-VN') }}</small>
            </div>
          
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute(); // Dùng để lấy ID sách trên thanh URL
const router = useRouter(); // Dùng để chuyển trang
const sach = ref(null);
const danhSachBinhLuan = ref([]);

const isLoggedIn = ref(false);
const isDocGia = ref(false);
const userId = ref(null);

// Khởi tạo form bình luận rỗng
const binhLuanMoi = ref({ diemDanhGia: 5, noiDung: '', sachId: route.params.id });

// 1. Kiểm tra "ví" xem ai đang đăng nhập
const kiemTraDangNhap = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    isLoggedIn.value = true;
    const user = JSON.parse(userStr);
    userId.value = user.id; // Lấy ID của người đang đăng nhập
    if (user.role === 'docgia') isDocGia.value = true;
  }
};

// 2. Lấy dữ liệu Sách và Bình luận
const taiDuLieu = async () => {
  try {
    // Lấy thông tin sách (Mẹo: Lấy toàn bộ mảng rồi dùng hàm find để bóc ra cuốn cần thiết)
    const resSach = await axios.get('http://localhost:3000/api/sach');
    sach.value = resSach.data.find(s => s._id === route.params.id);

    // Lấy bình luận từ API chúng ta đã viết ở Bước 3
    const resBL = await axios.get(`http://localhost:3000/api/danhgia/${route.params.id}`);
    danhSachBinhLuan.value = resBL.data;
  } catch (error) {
    console.error('Lỗi khi tải chi tiết sách:', error);
  }
};

// 3. Gửi bình luận
const guiBinhLuan = async () => {
  try {
    await axios.post('http://localhost:3000/api/danhgia', binhLuanMoi.value);
    binhLuanMoi.value.noiDung = ''; // Làm sạch ô nhập
    taiDuLieu(); // Load lại mảng bình luận để hiện lên ngay lập tức
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi khi gửi bình luận');
  }
};

// 4. Độc giả Gửi Yêu Cầu Mượn Sách
const guiYeuCauMuon = async () => {
  if(!confirm('Xác nhận gửi yêu cầu mượn cuốn sách này?')) return;
  
  try {
    const phieuMuon = {
      docGiaId: userId.value, // Lấy ID Độc giả trong ví
      sachId: sach.value._id,
      ngayMuon: new Date().toISOString().split('T')[0], // Lấy ngày hôm nay định dạng YYYY-MM-DD
      trangThai: 'Chờ duyệt'
    };
    
    // Gửi xuống API (Nó sẽ tự bị trừ 1 quyển sách trong kho nhớ logic ở bước trước)
    await axios.post('http://localhost:3000/api/theodoimuonsach', phieuMuon);
    alert('Đã gửi yêu cầu mượn thành công! Vui lòng theo dõi tiến độ tại trang Lịch Sử.');
    
    // Đẩy độc giả sang trang lịch sử cá nhân (Chúng ta sẽ làm trang này ở bước kế)
    router.push('/lichsu'); 
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra');
  }
};

onMounted(() => {
  kiemTraDangNhap();
  taiDuLieu();
});
</script>