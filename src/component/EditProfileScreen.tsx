import axios from "axios";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tokenService from '../service/tokenService';

const EditProfileScreen = ({route}) => {
    const navigation = useNavigation();
    // const [name, setName] = useState("");
    // const [avatar, setAvatar] = useState("");
    const { user } = route.params || {}; 

    const [name, setName] = useState(user?.name || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");

    // Hàm gửi dữ liệu cập nhật
    const handleSave = async () => {
        const token = await tokenService.getToken();

        if (!name || !avatar) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        try {
            const response = await axios.put("http://10.0.2.2:5000/v1/profile", {
                name,
                avatar
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            Alert.alert("Thành công", "Cập nhật thông tin thành công!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", error.response?.data?.message || "Không thể kết nối với máy chủ!");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require("../Image/back.png")} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Ảnh đại diện */}
            <View style={styles.avatarContainer}>
                <Image source={avatar ? { uri: avatar } : require("../Image/user-out.png")} style={styles.avatar} />
            </View>

            {/* Form chỉnh sửa */}
            <View style={styles.form}>
                <Text style={styles.label}>Họ và tên</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                <Text style={styles.label}>Link ảnh đại diện</Text>
                <TextInput
                    style={styles.input}
                    value={avatar}
                    onChangeText={setAvatar}
                    placeholder="Nhập link ảnh..."
                />
            </View>

            {/* Nút lưu */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    icon: {
        width: 24,
        height: 24,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    form: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: "black",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default EditProfileScreen;
