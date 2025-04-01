import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

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
        console.log("🔍 Token lấy được từ AsyncStorage:", token);

        const expirationTime = await AsyncStorage.getItem(TOKEN_EXPIRATION_KEY);
        console.log("⏳ Thời gian hết hạn token:", expirationTime);

        if (token && expirationTime) {
            const currentTime = Date.now();
            if (currentTime < parseInt(expirationTime)) {
                return token;
            } else {
                console.error("⏳ Token đã hết hạn!");
                await removeToken();
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error("❌ Lỗi khi lấy token:", error);
        return null;
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
        if (!token) {
            console.error("🚨 Không có token!");
            return null;
        }

        console.log("🔍 Token trước khi decode:", token);
        const decodedPayload = jwtDecode(token);
        console.log("✅ Decoded Token:", decodedPayload);

        const userId = decodedPayload.userId || decodedPayload.id;
        if (!userId) {
            console.error("🚨 Không tìm thấy userId hoặc id trong token!");
            return null;
        }

        console.log("✅ Lấy được userId:", userId);
        return { userId: decodedPayload.id, username: decodedPayload.email.split("@")[0] };
    } catch (error) {
        console.error("❌ Lỗi giải mã token:", error);
        return null;
    }
};


export default {
    setToken,
    getToken,
    removeToken,
    getUserIdFromToken,
};
