import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import tokenService from "../service/tokenService";
import { jwtDecode } from "jwt-decode";
import { getProvinces, getDistrictsByProvinceId, getWardsByDistrictId } from "../service/addressService";

const EditAddressForm = ({ address, onClose, refreshAddresses }) => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [detail, setDetail] = useState("");
    const [isDefault, setIsDefault] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Load thông tin địa chỉ khi mở form
    useEffect(() => {
        if (address) {
            setName(address.name || "");
            setPhoneNumber(address.phoneNumber || "");
            setProvince(address.province?.id?.toString() || "");
            setDistrict(address.district?.id?.toString() || "");
            setWard(address.ward?.id?.toString() || "");
            setDetail(address.addressDetail || "");
            setIsDefault(address.isDefault || false);
            console.log("📌 Dữ liệu address nhận vào:", address);
        } else {
            console.log("⚠️ Không có dữ liệu address khi mở form!");
        }
    }, [address]);


    // Load danh sách tỉnh
    useEffect(() => {
        getProvinces().then(data => setProvinces(data || []));
    }, []);

    // Load quận khi chọn tỉnh
    useEffect(() => {
        if (province) {
            getDistrictsByProvinceId(province).then(data => setDistricts(data || []));
            setDistrict("");
            setWards([]);
            setWard("");
        }
    }, [province]);

    // Load xã khi chọn quận
    useEffect(() => {
        if (district) {
            getWardsByDistrictId(district).then(data => setWards(data || []));
            setWard("");
        }
    }, [district]);

    // Xử lý cập nhật địa chỉ
    const handleUpdate = async () => {
        if (!name || !phoneNumber || !province || !district || !ward || !detail) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const token = await tokenService.getToken();
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken?.email;
        const addressId = address?._id?.toString() || "";

        if (!addressId) {
            Alert.alert("Lỗi", "Không tìm thấy ID của địa chỉ cần cập nhật!");
            return;
        }
        console.log("📌 Address ID khi gửi API:", addressId);

        if (!userEmail || !addressId) {
            Alert.alert("Lỗi", "Dữ liệu không hợp lệ!");
            return;
        }

        console.log("📌 Dữ liệu trước khi gửi:", {
            email: userEmail,
            addressId,
            name,
            phoneNumber,
            provinceId: province,
            districtId: district,
            wardCode: ward,
            addressDetail: detail.trim(),
            isDefault,
        });

        try {
            const response = await axios.post("http://10.0.2.2:5000/v1/user/update-address", {
                email: userEmail,
                addressId,
                name,
                phoneNumber,
                provinceId: province,
                districtId: district,
                wardCode: ward,
                addressDetail: detail.trim(),
                isDefault,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("✅ API Response:", response.data);
            Alert.alert("Thành công", "Địa chỉ đã được cập nhật!");
            refreshAddresses();
            onClose();
        } catch (error) {
            console.error("❌ Update Error:", error.response?.data || error.message);
            Alert.alert("Lỗi", error.response?.data?.message || "Không thể cập nhật địa chỉ. Vui lòng thử lại!");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chỉnh sửa địa chỉ</Text>

            <Text style={styles.label}>Họ và tên</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" maxLength={10} />

            <Text style={styles.label}>Tỉnh/Thành phố</Text>
            <Picker selectedValue={province} onValueChange={setProvince} style={styles.picker}>
                {provinces.map(p => <Picker.Item key={p.ProvinceID} label={p.ProvinceName} value={p.ProvinceID} />)}
            </Picker>

            <Text style={styles.label}>Quận/Huyện</Text>
            <Picker selectedValue={district} onValueChange={setDistrict} style={styles.picker} enabled={!!province}>
                {districts.map(d => <Picker.Item key={d.DistrictID} label={d.DistrictName} value={d.DistrictID} />)}
            </Picker>

            <Text style={styles.label}>Phường/Xã</Text>
            <Picker selectedValue={ward} onValueChange={setWard} style={styles.picker} enabled={!!district}>
                {wards.map(w => <Picker.Item key={w.WardCode} label={w.WardName} value={w.WardCode} />)}
            </Picker>

            <Text style={styles.label}>Địa chỉ cụ thể</Text>
            <TextInput style={styles.input} value={detail} onChangeText={setDetail} />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    label: { fontSize: 14, fontWeight: "600", marginTop: 10 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
    picker: { height: 50, marginBottom: 10 },
    saveButton: { backgroundColor: "black", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 15 },
    saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" }
});

export default EditAddressForm;
