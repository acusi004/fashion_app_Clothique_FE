// productService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm lấy token từ AsyncStorage
const getToken = async () => {
    try {
        return await AsyncStorage.getItem('accessToken');
    } catch (error) {
        console.error('Lỗi khi lấy token:', error);
        return null;
    }
};

// Hàm gọi API lấy danh sách sản phẩm
export const fetchProducts = async () => {
    try {
        const token = await getToken();
        if (!token) {
            console.log('Chưa đăng nhập, không lấy được dữ liệu sản phẩm');
            return null; // hoặc bạn có thể ném lỗi nếu muốn xử lý ở component
        }

        const response = await axios.get('http://10.0.2.2:5000/v1/product', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Giả sử API trả về danh sách sản phẩm trực tiếp trong response.data
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        throw error; // ném lỗi ra ngoài để component có thể xử lý nếu cần
    }
};
