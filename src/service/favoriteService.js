import axios from 'axios';
import tokenService from './tokenService';


export const toggleFavorite = async (productId) => {
    const token = await tokenService.getToken();
    try {
        const response = await axios.post(
            `http://10.0.2.2:5000/v1/favourite/toggle`,
            { productId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Ví dụ: { message: "Đã thêm vào danh sách yêu thích" } hoặc "Đã xóa khỏi danh sách yêu thích"
    } catch (error) {
        console.error("Lỗi toggle favorite:", error);
        throw error;
    }
};

export const removeFavorite = async (productId) => {
    const token = await tokenService.getToken();
    try {
        const response = await axios.delete(
            `http://10.0.2.2:5000/v1/favourite/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi remove favorite:", error);
        throw error;
    }
};

export const checkFavorite = async (productId) => {
    const token = await tokenService.getToken();
    try {
        const response = await axios.get(
            `http://10.0.2.2:5000/v1/favourite/check/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Ví dụ: { favourite: true } hoặc { favourite: false }

    } catch (error) {
        console.error("Lỗi check favorite:", error);
        throw error;
    }
};

export const getUserFavorites = async () => {
    const token = await tokenService.getToken();
    try {
        const response = await axios.get(`http://10.0.2.2:5000/v1/favourite/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Ví dụ: { favourites: [...] }
    } catch (error) {
        console.error("Lỗi get user favorites:", error);
        throw error;
    }
};
