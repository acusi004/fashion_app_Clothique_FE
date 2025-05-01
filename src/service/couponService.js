// services/couponService.ts
import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:5000/v1'; // Đổi thành endpoint thực tế
import {getToken} from './categoryService';

export const getCoupons = async (code = '') => {
  try {
    const query = code ? `?code=${encodeURIComponent(code)}` : '';
    const token = await getToken();
    const response = await axios.get(`${API_BASE_URL}/coupon`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error; // Ném lỗi để component có thể xử lý
  }
};

