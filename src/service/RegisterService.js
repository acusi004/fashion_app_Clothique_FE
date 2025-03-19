import axios from 'axios';
import { API_URL } from '@env'; // Hoặc thay thế bằng URL backend của bạn

// Hàm đăng ký người dùng
const register = async (userData) => {
    try {
        const response = await axios.post('http://10.0.2.2:5000/v1/auth/register', userData);
        return response.data; // Trả về dữ liệu từ API (ví dụ thông tin user)
    } catch (error) {
        // Lấy thông báo lỗi từ backend nếu có
        const errorMsg = error.response?.data?.message || error.message;
        throw new Error(errorMsg);
    }
};

export default {
    register,
};
