import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getProvinces, getDistrictsByProvinceId, getWardsByDistrictId } from "../service/addressService";

const AddressForm = ({ onSave, onClose }) => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(""); // 🔹 Thêm số điện thoại
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [detail, setDetail] = useState("");
    // const [isDefault, setIsDefault] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const validatePhoneNumber = (phone) => {
        if (!phone) return "Vui lòng nhập số điện thoại!";
        if (!/^\d+$/.test(phone)) return "Số điện thoại chỉ được chứa chữ số!";
        if (phone.length !== 10) return "Số điện thoại phải có đúng 10 chữ số!";
        if (!/^(03|05|07|08|09)[0-9]{8}$/.test(phone)) return "Số điện thoại không hợp lệ! Vui lòng nhập số hợp lệ tại Việt Nam.";
        return null; // Hợp lệ
    };

    useEffect(() => {
        const fetchData = async () => {
            const provincesData = await getProvinces();
            if (provincesData) setProvinces(provincesData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (province) {
            getDistrictsByProvinceId(province).then((data) => setDistricts(data || []));
            setDistrict("");
            setWards([]);
            setWard("");
        }
    }, [province]);

    useEffect(() => {
        if (district) {
            getWardsByDistrictId(district).then((data) => setWards(data || []));
            setWard("");
        }
    }, [district]);

    const handleSave = () => {
        console.log("📌 Kiểm tra dữ liệu trước khi lưu:");
        console.log("Name:", name);
        console.log("Phone:", phoneNumber);
        console.log("Province:", province);
        console.log("District:", district);
        console.log("Ward:", ward);
        console.log("Detail:", detail);

        if (!name.trim() || !phoneNumber.trim() || !province || !district || !ward || !detail.trim()) {
            Alert.alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const phoneError = validatePhoneNumber(phoneNumber.trim());
        if (phoneError) {
            Alert.alert("Lỗi", phoneError);
            return;
        }

        let newAddress = {
            name: name.trim(),
            phoneNumber: phoneNumber.trim(), // ✅ Thêm số điện thoại
            addressDetail: detail.trim(),
            provinceId: Number(province),
            districtId: Number(district),
            wardCode: String(ward)
            // isDefault: isDefault
        };
        console.log("📌 Dữ liệu gửi đi:", newAddress);
        onSave(newAddress);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thêm địa chỉ mới</Text>

            {/* 🔹 Nhập họ tên */}
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput style={styles.input} placeholder="Nhập họ và tên" value={name} onChangeText={setName} />

            {/* 🔹 Nhập số điện thoại */}
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad" // 🛠 Hỗ trợ bàn phím số 
                maxLength={10} // Giới hạn 10 số
            />

            <Text style={styles.label}>Tỉnh/Thành phố</Text>
            <Picker selectedValue={province} onValueChange={(value) => {
                console.log("📌 Province chọn:", value);
                setProvince(value);
            }} style={styles.picker}>
                <Picker.Item label="Chọn Tỉnh/Thành phố" value="" />
                {provinces.map((p, index) => (
                    <Picker.Item key={`province-${p.ProvinceID || index}`} label={p.ProvinceName} value={p.ProvinceID} />
                ))}
            </Picker>

            <Text style={styles.label}>Quận/Huyện</Text>
            <Picker selectedValue={district} onValueChange={(value) => {
                console.log("📌 District chọn:", value);
                setDistrict(value);
            }} style={styles.picker} enabled={!!province}>
                <Picker.Item label="Chọn Quận/Huyện" value="" />
                {districts.map((d, index) => (
                    <Picker.Item key={`district-${d.DistrictID || index}`} label={d.DistrictName} value={d.DistrictID} />
                ))}
            </Picker>

            <Text style={styles.label}>Phường/Xã</Text>
            <Picker selectedValue={ward} onValueChange={(value) => {
                console.log("📌 Ward chọn:", value);
                setWard(value);
            }} style={styles.picker} enabled={!!district}>
                <Picker.Item label="Chọn Phường/Xã" value="" />
                {wards.map((w, index) => (
                    <Picker.Item key={`ward-${w.WardCode || index}`} label={w.WardName} value={w.WardCode} />
                ))}
            </Picker>

            <Text style={styles.label}>Địa chỉ cụ thể</Text>
            <TextInput style={styles.input} placeholder="Số nhà, đường,..." value={detail} onChangeText={setDetail} />

            {/* <View style={styles.switchContainer}>
                <Text>Đặt làm mặc định</Text>
                <Switch
                    value={isDefault}
                    onValueChange={(value) => {
                        console.log("📌 Giá trị mới của isDefault:", value);
                        setIsDefault(value);
                    }}
                />
            </View> */}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    label: { fontSize: 14, fontWeight: "600", marginTop: 10 },
    input: { borderWidth: 1, borderColor: "gray", borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: "#f9f9f9" },
    picker: { borderWidth: 1, borderColor: "gray", borderRadius: 10, backgroundColor: "#f9f9f9" },
    switchContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 },
    saveButton: { backgroundColor: "black", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 15 },
    saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    cancelButton: { backgroundColor: "gray", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
    cancelButtonText: { color: "white", fontSize: 16 }
});

export default AddressForm;
