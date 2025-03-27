import axios from "axios";

const API_BASE_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data";
const TOKEN = "a2dd37c3-0227-11f0-b5cc-72ffd7cd7a15";

export const getProvinces = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/province`, {
            headers: {
                "Token": TOKEN,
                "Content-Type": "application/json"
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách tỉnh:", error);
        return [];
    }
};

export const getDistrictsByProvinceId = async (provinceId) => {
    if (!provinceId) return [];
    try {
        const response = await axios.get(`${API_BASE_URL}/district`, {
            headers: {
                "Token": TOKEN,
                "Content-Type": "application/json"
            },
            params: { province_id: provinceId }
        });
        return response.data.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách quận:", error);
        return [];
    }
};

export const getWardsByDistrictId = async (districtId) => {
    if (!districtId) return [];

    try {
        const response = await axios.post(
            `${API_BASE_URL}/ward`,
            { district_id: Number(districtId) },  // Gửi district_id qua body
            {
                headers: {
                    "Token": TOKEN,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("📌 API GHN Response:", response.data);

        return response.data.data || [];
    } catch (error) {
        console.error("❌ Lỗi lấy danh sách phường:", error);
        return [];
    }
};

