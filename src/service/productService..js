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
    console.log(response.data)
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





export const FilterProducts = async (keyword, size, color, minPrice, maxPrice, quantity, categoryId) => {
  try {
    const token = await getToken();

    const params = {};

    if (keyword) params.keyword = keyword;
    if (size) params.size = size;
    if (color) params.color = color;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (quantity) params.stock = quantity;
    if (categoryId) params.categoryId = categoryId;

    const response = await axios.get(`${API_URL}/product/search`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error('Lỗi tìm kiếm sản phẩm:', err.response?.data || err.message);
    return [];
  }
};




export const fetchCategories = async () => {
  try {
    const token = await getToken();

    const response = await axios.get(`${API_URL}/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    const categoryList = data.categories || data; // hỗ trợ cả 2 dạng trả về

    if (!Array.isArray(categoryList)) {
      throw new Error("❌ Dữ liệu không phải mảng!");
    }

    return categoryList;
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách danh mục:", error.response?.data || error.message);
    throw error;
  }
};



