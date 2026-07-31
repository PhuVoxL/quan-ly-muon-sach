<template>
  <div>
    <!-- Thanh Menu (Navbar) của Bootstrap -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <!-- router-link giống như thẻ <a> nhưng nó chuyển trang không cần load lại web -->
        <router-link class="navbar-brand" to="/">Thư Viện</router-link>
        
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Trang chủ</router-link>
            </li>
            <li class="nav-item">
              <!-- Tạm để dấu #, bước sau chúng ta sẽ làm trang Nhà Xuất Bản thực sự -->
              <a class="nav-link" href="#">Nhà Xuất Bản</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Nội dung của các trang con sẽ được Vue "bơm" vào vị trí của thẻ router-view này -->
    <div class="container mt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
/* Bạn có thể viết thêm CSS tự chọn ở đây nếu cần */
</style>