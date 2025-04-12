// authService.js
import axios from 'axios';
import tokenService from './tokenService'; // file tokenService.js bạn đã có
// Giả sử bạn có biến API_URL toàn cục hoặc đưa thẳng /v1/auth/login vào URL

const loginUser = async (email, password) => {
    try {
        const response = await axios.post('http://10.0.2.2:5000/v1/auth/login', { email, password });


        const { accessToken } = response.data;
        if (!accessToken) throw new Error("Không nhận được accessToken!");

        await tokenService.setToken(accessToken);

        // Debug kiểm tra lại token sau khi lưu
        const checkToken = await tokenService.getToken();
        console.log("✅ Token sau khi lưu:", checkToken);

        return response.data;
    } catch (error) {

        throw error;
    }
};


export default {
    loginUser,
};
