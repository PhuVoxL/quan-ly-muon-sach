<template>
  <div>
    <h2 class="mb-4 text-center text-primary fw-bold">Khám Phá Thư Viện</h2>
    
    <!-- Thanh tìm kiếm -->
    <div class="row mb-5 justify-content-center">
      <div class="col-md-6">
        <input type="text" class="form-control form-control-lg border-primary shadow-sm" 
               placeholder="Nhập tên sách để tìm kiếm nhanh..." v-model="tuKhoa">
      </div>
    </div>

    <!-- Lưới hiển thị sách -->
    <div class="row">
      <div class="col-md-3 mb-4" v-for="sach in sachLocDuoc" :key="sach._id">
        <div class="card h-100 shadow-sm border-0 bg-light">
          
          <img :src="sach.hinhAnh || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'" 
               class="card-img-top object-fit-cover" style="height: 280px;" alt="Bìa sách">
          
               <div class="card-body text-center d-flex flex-column justify-content-center">
            <h5 class="card-title fw-bold text-dark mb-3">{{ sach.tenSach }}</h5>
            <p class="text-muted small mb-2">Tác giả: {{ sach.tacGia }}</p>
            <div class="mt-auto">
              <span class="badge mb-3 fs-6" :class="sach.soQuyen > 0 ? 'bg-success' : 'bg-danger'">
                {{ sach.soQuyen > 0 ? `Còn ${sach.soQuyen} quyển` : 'Đã hết' }}
              </span>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0 pb-3 text-center">
            <!-- Nút chuyển sang trang Chi tiết -->
            <router-link :to="`/chitiet/${sach._id}`" class="btn btn-outline-primary w-100 fw-bold">Xem Chi Tiết</router-link>
          </div>
        </div>
      </div>
      
      <!-- Thông báo khi không tìm thấy -->
      <div class="text-center text-muted mt-4" v-if="sachLocDuoc.length === 0">
        <h5>Không tìm thấy cuốn sách nào phù hợp với từ khóa của bạn.</h5>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const danhSachSach = ref([]);
const tuKhoa = ref('');

// Lấy toàn bộ sách từ Backend
const layDuLieu = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/sach');
    danhSachSach.value = res.data;
  } catch (error) {
    console.error('Lỗi tải sách:', error);
  }
};

// Computed property: Tự động lọc danh sách mỗi khi người dùng gõ phím vào tuKhoa
const sachLocDuoc = computed(() => {
  return danhSachSach.value.filter(sach => 
    sach.tenSach.toLowerCase().includes(tuKhoa.value.toLowerCase())
  );
});

onMounted(() => {
  layDuLieu();
});
</script>