// authService.js
import axios from 'axios';
import tokenService from './tokenService'; // file tokenService.js bạn đã có
// Giả sử bạn có biến API_URL toàn cục hoặc đưa thẳng /v1/auth/login vào URL

const loginUser = async (email, password) => {
    try {
        const response = await axios.post('http://10.0.2.2:5000/v1/auth/login', { email, password });
        const { accessToken } = response.data;

        console.log("✅ Token nhận được sau login:", accessToken); // Kiểm tra token
        await tokenService.setToken(accessToken);

        return response.data;
    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error.response?.data || error.message);
        throw error;
    }
};

export default {
    loginUser,
};
