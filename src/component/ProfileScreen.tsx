import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

function ProfileScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* <TouchableOpacity onPress={() => alert("Chức năng thêm mới")}> 
                    <Image source={require("../Image/add.png")} style={styles.icon} />
                </TouchableOpacity> */}
                <Text style={styles.title}>Hồ sơ cá nhân</Text>
                <TouchableOpacity onPress={() => navigation.navigate("EditProfileScreen")}>
                    <Image source={require("../Image/edit.png")} style={styles.icon} />
                </TouchableOpacity>
            </View>

            {/* Thông tin người dùng */}
            <View style={styles.profileContainer}>
                <Image source={require("../Image/user-out.png")} style={styles.avatar} />
                <View>
                    <Text style={styles.userName}>Đỗ Trung Hiếu</Text>
                    <Text style={styles.email}>hieudtph35761@fpt.edu.vn</Text>
                </View>
            </View>

            {/* Danh sách menu */}
            <MenuItem title="Đơn hàng của tôi" subtitle="Đã có 10 đơn hàng" iconSource={require("../Image/frame.png")} onPress={() => navigation.navigate("OrderScreen")} />
            <MenuItem title="Địa chỉ giao hàng" subtitle="Địa chỉ cá nhân" iconSource={require("../Image/frame.png")} onPress={() => navigation.navigate("AddressScreen")} />
            <MenuItem title="Đánh giá của tôi" subtitle="Đã đánh giá 5 mục" iconSource={require("../Image/frame.png")} onPress={() => navigation.navigate("FavoriteScreen")} />
            <MenuItem title="Cài đặt" subtitle="Thông báo, Mật khẩu, FAQ" iconSource={require("../Image/frame.png")} onPress={() => navigation.navigate("SettingsScreen")} />
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    title: {
        marginLeft: 100,
        fontSize: 22,
        fontWeight: "bold",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#f5f5f5",
        borderRadius: 15,
        marginBottom: 20,
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
});

export default ProfileScreen;