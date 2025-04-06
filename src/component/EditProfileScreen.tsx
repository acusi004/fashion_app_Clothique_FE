import axios from "axios";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'react-native-image-picker';
import tokenService from '../service/tokenService';

const EditProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const { user } = route.params || {};

    const [name, setName] = useState(user?.name || "");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");

    const handlePickImage = async () => {
        ImagePicker.launchImageLibrary(
            { mediaType: 'photo', quality: 0.7 },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    Alert.alert("Lỗi", "Không thể chọn ảnh.");
                    return;
                }

                const file = response.assets[0];
                setAvatar({
                    uri: file.uri,
                    name: file.fileName || "avatar.jpg",
                    type: file.type || "image/jpeg",
                });
                setAvatarPreview(file.uri);
            }
        );
    };

    const handleSave = async () => {
        const token = await tokenService.getToken();

        if (!name) {
            Alert.alert("Lỗi", "Vui lòng nhập họ tên.");
            return;
        }

        if (!/^\d{10,15}$/.test(phoneNumber)) {
            Alert.alert("Lỗi", "Số điện thoại không hợp lệ. Vui lòng nhập từ 10 đến 15 chữ số.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name); // Dữ liệu họ tên
        formData.append("phoneNumber", phoneNumber); // Dữ liệu số điện thoại
        if (avatar) {
            formData.append("avatar", avatar); // File ảnh
        }

        try {
            const response = await axios.put(
                "http://10.0.2.2:5000/v1/profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            Alert.alert("Thành công", "Cập nhật thông tin thành công!");
            navigation.goBack();
        } catch (error) {
            console.log("UPLOAD ERROR:", error);
            Alert.alert("Lỗi", error.response?.data?.message || "Không thể kết nối với máy chủ!");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require("../Image/back.png")} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={handlePickImage}>
                    <Image
                        source={avatarPreview ? { uri: avatarPreview } : require("../Image/user-out.png")}
                        style={styles.avatar}
                    />
                    <Text style={{ textAlign: 'center', color: 'blue', marginTop: 5 }}>Chọn ảnh</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Họ và tên</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                />
            </View>

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
