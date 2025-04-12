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
export const fetchProducts = async (page = 1, limit = 10) => {
    const token = await getToken();
    const response = await axios.get(`http://10.0.2.2:5000/v1/product?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};




// Thay đổi API_URL theo backend của bạn
const API_URL = "http://10.0.2.2:5000/v1";

// Hàm gọi API tìm kiếm sản phẩm theo từ khóa
export const searchProducts = async (keyword) => {
    const token = await getToken();
    if (!token) {
        console.log('Chưa đăng nhập, không lấy được dữ liệu sản phẩm');
        return null; // hoặc bạn có thể ném lỗi nếu muốn xử lý ở component
    }else{
        if (!keyword.trim()) return []; // Nếu query rỗng trả về mảng rỗng
        try {
            const response = await fetch(
                `${API_URL}/product/search?keyword=${encodeURIComponent(keyword)}`,{
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                console.log("Response status:", response.status, response.statusText);
                throw new Error("Lỗi khi tải dữ liệu sản phẩm");
            }
            const data = await response.json();
            return data; // Giả sử API trả về danh sách sản phẩm
        } catch (error) {
            console.error("Error searching products:", error);
            throw error;
        }
    }
};
export const fetchCategories = async () => {
    const token = await getToken();

    const response = await fetch("http://10.0.2.2:5000/v1/category", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    console.log("📥 Kết quả category:", data);

    if (!response.ok) {
        throw new Error(data.message || "Lỗi không xác định từ API danh mục.");
    }

    const categoryList = data.categories || data; // hỗ trợ cả 2 format
    if (!Array.isArray(categoryList)) {
        throw new Error("❌ Dữ liệu không phải mảng!");
    }

    return categoryList;
};



