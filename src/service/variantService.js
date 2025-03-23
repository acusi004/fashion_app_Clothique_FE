import axios from 'axios';
import tokenService from './tokenService';

 const getVariantByProductId = async (productId) => {
    const token = await tokenService.getToken();
    try {
        const response = await axios.get(`http://10.0.2.2:5000/v1/variant/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // Giả sử BE trả về { variants: [ ... ] }
        return response.data;
    } catch (error) {
        console.error("Lỗi getVariantByProductId:", error);
        throw error;
    }
};

 export default getVariantByProductId;
