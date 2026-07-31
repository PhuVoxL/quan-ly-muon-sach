import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios'; // Import axios vào đây

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// --- TRẠM KIỂM SOÁT AXIOS ---
// Mỗi khi Frontend gửi một yêu cầu (request) xuống Backend...
axios.interceptors.request.use((config) => {
    // 1. Mở ví (localStorage) lấy thẻ (token)
    const token = localStorage.getItem('token');
    
    // 2. Nếu có thẻ, dán nó vào Header của request
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Cho phép yêu cầu tiếp tục chạy xuống Backend
}, (error) => {
    return Promise.reject(error);
});
// ----------------------------

const app = createApp(App);
app.use(router);
app.mount('#app');