import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Alert } from "react-native";
import AddressForm from "./AddressForm.tsx";
import EditAddressForm from "./EditAddressForm.tsx"; // 🔹 Import form sửa địa chỉ
import tokenService from '../service/tokenService';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AddressScreen = () => {
    const [addresses, setAddresses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const closeModal = () => {
        setEditModalVisible(false);
        setSelectedAddress(null);
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                console.error("❌ Không tìm thấy token!");
                return Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
            }

            let decodedToken;
            try {
                decodedToken = jwtDecode(token);
            } catch (err) {
                console.error("❌ Lỗi giải mã token:", err);
                return Alert.alert("Lỗi", "Token không hợp lệ!");
            }

            const userEmail = decodedToken?.email;
            if (!userEmail) {
                console.error("❌ Không lấy được email từ token!", decodedToken);
                return Alert.alert("Lỗi", "Email không hợp lệ!");
            }

            console.log("📌 Token gửi đi:", token);
            console.log("📌 Email gửi đi:", userEmail);

            const response = await axios.get("http://10.0.2.2:5000/v1/user/addresses", {
                headers: { Authorization: `Bearer ${token}` },
                params: { email: userEmail }
            });

            const normalized = response.data.addresses.map(addr => ({
                ...addr,
                province: { id: addr.provinceId, name: addr.provinceName },
                district: { id: addr.districtId, name: addr.districtName },
                ward: { id: addr.wardCode, name: addr.wardName },
            }));

            console.log("📌 API trả về danh sách địa chỉ:", response.data);
            console.log("✅ Danh sách địa chỉ nhận được:", response.data);
            setAddresses(normalized);
            setAddresses(response.data.addresses);
        } catch (error) {
            console.error("❌ Lỗi khi lấy danh sách địa chỉ:", error.response?.data || error.message);
            Alert.alert("Lỗi", error.response?.data?.message || "Không thể tải danh sách địa chỉ.");
        }
    };


    const handleAddAddress = async (newAddress) => {
        try {
            const token = await tokenService.getToken();
            const decodedToken = jwtDecode(token);
            const userEmail = decodedToken?.email;

            if (!userEmail) {
                return Alert.alert("Lỗi", "Không tìm thấy email!");
            }

            console.log("📌 Email gửi đi:", userEmail);

            const response = await axios.post(
                "http://10.0.2.2:5000/v1/user/add-address",
                { ...newAddress, email: userEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Địa chỉ mới:", response.data);
            fetchAddresses();
            setAddresses(response.data.addresses);
            setModalVisible(false);
        } catch (error) {
            console.error("❌ Lỗi khi thêm địa chỉ:", error.response?.data || error.message);
            Alert.alert("Lỗi", "Không thể thêm địa chỉ.");
        }
    };

    const handleEditAddress = (selected) => {
        console.log("📌 Địa chỉ được chọn để chỉnh sửa:", selected);

        if (!selected || !selected._id) {
            console.error("❌ Không có ID hợp lệ!", selected);
            Alert.alert("Lỗi", "Dữ liệu địa chỉ bị thiếu ID!");
            return;
        }
        setSelectedAddress(selected);
        setTimeout(() => setEditModalVisible(true), 100);
    };

    const handleDeleteAddress = async (addressId) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc muốn xóa địa chỉ này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            const token = await tokenService.getToken();
                            const decodedToken = jwtDecode(token);
                            const userEmail = decodedToken?.email;

                            if (!userEmail) {
                                return Alert.alert("Lỗi", "Không tìm thấy email!");
                            }

                            const response = await axios.post(
                                "http://10.0.2.2:5000/v1/user/remove-address",
                                { email: userEmail, addressId },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            console.log("✅ Xóa thành công:", response.data);
                            Alert.alert("Thành công", "Địa chỉ đã được xóa!");
                            setAddresses(response.data.addresses);
                        } catch (error) {
                            console.error("❌ Lỗi khi xóa địa chỉ:", error.response?.data || error.message);
                            Alert.alert("Lỗi", "Không thể xóa địa chỉ.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Địa chỉ của bạn</Text>

            <FlatList
                data={addresses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.addressCard}
                        onPress={() => handleEditAddress(item)}
                    >
                        <View style={styles.addressCard}>
                            <Text style={styles.name}>{item?.name || "Không có tên"}</Text>
                            <Text style={styles.address}>
                                {item?.addressDetail || "Không có địa chỉ"},{" "}
                                {item?.province?.name || item?.provinceName || "Không có tỉnh"},{" "}
                                {item?.district?.name || item?.districtName || "Không có huyện"},{" "}
                                {item?.ward?.name || item?.wardName || "Không có xã"}
                            </Text>
                        </View>
                        {/* Nút xóa */}
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteAddress(item._id)}
                        >
                            <Text style={styles.deleteIcon}>🗑</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <AddressForm onSave={handleAddAddress} onClose={() => setModalVisible(false)} />
            </Modal>
            {editModalVisible && selectedAddress && (
                <Modal visible={editModalVisible} animationType="slide">
                    <EditAddressForm
                        address={selectedAddress}
                        onClose={closeModal}
                        refreshAddresses={fetchAddresses}
                    />
                </Modal>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    header: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    addressCard: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10, marginBottom: 10 },
    name: { fontSize: 16, fontWeight: "bold" },
    address: { fontSize: 14, color: "gray" },
    addButton: { position: "absolute", bottom: 20, right: 20, backgroundColor: "black", padding: 15, borderRadius: 30 },
    addButtonText: { color: "white", fontSize: 20 },
    defaultText: {
        fontSize: 14,
        color: "red", // ✅ Mặc định màu đỏ
        fontWeight: "bold",
        textAlign: "right",
        marginTop: 5,
    },
    deleteButton: {
        width: 40, // Nhỏ gọn hơn
        height: 40,
        borderRadius: 20, // Bo tròn hoàn toàn
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 300,
    },
    deleteIcon: {
        color: "black",
        fontSize: 20, // Biểu tượng lớn hơn
        fontWeight: "bold",
    },
});

export default AddressScreen;
