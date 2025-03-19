// authService.js
import axios from 'axios';
import tokenService from './tokenService'; // file tokenService.js bạn đã có
// Giả sử bạn có biến API_URL toàn cục hoặc đưa thẳng /v1/auth/login vào URL

const loginUser = async (email, password) => {
    try {
        // Gọi đến API /v1/auth/login
        // data yêu cầu tuỳ theo backend. Ví dụ: { email, password }
        const response = await axios.post('http://10.0.2.2:5000/v1/auth/login', {
            email,
            password,
        }); 

        // Lấy accessToken từ response
        const { accessToken } = response.data;

        // Lưu token vào AsyncStorage nhờ tokenService
        await tokenService.setToken(accessToken);

        // Trả về data (hoặc token) tuỳ mục đích
        return response.data;
    } catch (error) {
        // Tuỳ backend trả về mà bạn xử lý
        // Ở đây mình ném error để phần gọi hàm tự xử lý
        throw error;
    }
};

export default {
    loginUser,
};
