import axios from "axios";
import tokenService from '../service/tokenService';
import React, { useEffect, useState, useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";


// Component MenuItem tái sử dụng
function MenuItem({ title, subtitle, iconSource, onPress }) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View>
                <Text style={styles.menuText}>{title}</Text>
                <Text style={styles.subText}>{subtitle}</Text>
            </View>
            <Image source={iconSource} style={styles.icon} />
        </TouchableOpacity>
    );
}

function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchUserProfile(); // Load lại dữ liệu khi màn hình được focus
        }, [])
    );
    const fetchUserProfile = async () => {
        try {
            const token = await tokenService.getToken();
            console.log("🔑 Token gửi đi:", token);

            if (!token) {
                console.error("❌ Token không tồn tại");
                return;
            }

            const response = await axios.get("http://10.0.2.2:5000/v1/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(response.data.user);
        } catch (error) {
            console.error("❌ Lỗi khi lấy dữ liệu user:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <ActivityIndicator size="large" color="blue" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Hồ sơ cá nhân</Text>
            </View>

            <View style={styles.profileContainer}>
                <Image
                    source={user?.avatar ? { uri: user.avatar } : require("../Image/user-out.png")}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user?.name || "Người dùng"}</Text>
                    <Text style={styles.email}>{user?.email || "Chưa có email"}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfileScreen", { user })}>
                    <Image source={require("../Image/edit.png")} style={styles.editIcon} />
                </TouchableOpacity>
            </View>

            {/* Danh sách menu */}
            <MenuItem title="Đơn hàng của tôi" subtitle="Đơn hàng đã có sẵn" iconSource={require("../Image/frame.png")} onPress={() => navigation.navigate("OrderScreen")} />
            <MenuItem title="Địa chỉ giao hàng" subtitle="Địa chỉ cá nhân" iconSource={require("../Image/frame.png")} onPress={() => navigation.navigate("AddressScreen")} />
            <MenuItem title="Đánh giá của tôi" subtitle="Đã đánh giá sản phẩm" iconSource={require("../Image/frame.png")} onPress={() => navigation.navigate("FavoriteScreen")} />
            <MenuItem title="Cài đặt" subtitle="Mật khẩu, FAQ, Chatting" iconSource={require("../Image/frame.png")} onPress={() => navigation.navigate("SettingScreen")} />
            <MenuItem title="Đăng xuất" subtitle="Đăng xuất tài khoản" iconSource={require("../Image/frame.png")} onPress={() => navigation.replace("ChoseScreen")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        marginLeft: 20,
    },
    title: {
        marginLeft: 100,
        fontSize: 22,
        fontWeight: "bold",
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "gray",
    },
    menuItem: {
        backgroundColor: "#f5f5f5",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    menuText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    subText: {
        fontSize: 14,
        color: "gray",
        marginTop: 3,
    },
    icon: {
        width: 24,
        height: 24,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#f5f5f5",
        borderRadius: 15,
        marginBottom: 20,
        justifyContent: "space-between",
    },
    userInfo: {
        flex: 1,
        marginLeft: 10,
    },
    editButton: {
        width: 35,
        height: 35,
        backgroundColor: "#e0e0e0",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    editIcon: {
        width: 18,
        height: 18,
        tintColor: "#555",
    },
});

export default ProfileScreen;
