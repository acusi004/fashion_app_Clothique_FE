import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const TOKEN_KEY = 'accessToken';
const TOKEN_EXPIRATION_KEY = 'accessTokenExpiration';

// Lưu token và thời gian hết hạn
const setToken = async (token, expiresIn = 3600) => {
    try {
        const expirationTime = Date.now() + expiresIn * 1000; // tính thời gian hết hạn (ms)
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(TOKEN_EXPIRATION_KEY, expirationTime.toString());
    } catch (error) {
        console.error('Failed to save the token', error);
    }
};

// Lấy token nếu chưa hết hạn
const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const expirationTime = await AsyncStorage.getItem(TOKEN_EXPIRATION_KEY);
        if (token && expirationTime) {
            const currentTime = Date.now();
            if (currentTime < parseInt(expirationTime)) {
                return token;
            } else {
                // Nếu token đã hết hạn, xóa nó
                await removeToken();
                console.error('Token has expired');
            }
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch the token', error);
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(TOKEN_EXPIRATION_KEY);
    } catch (error) {
        console.error('Failed to remove the token', error);
    }
};

// Hàm giải mã token để lấy thông tin (nếu cần)
const getUserIdFromToken = async () => {
    try {
        const token = await getToken();
        if (token) {
            const decodedPayload = jwt_decode(token);
            return decodedPayload.id; // giả sử payload chứa thuộc tính `id`
        }
        return null;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

export default {
    setToken,
    getToken,
    removeToken,
    getUserIdFromToken,
};
