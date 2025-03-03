import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";





function ProfileScreen(){

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Image source={require('../Image/add.png')} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
                <Text style={styles.title}>Cá nhân</Text>
                <View style={{ width: 28 }} /> {/* Giữ tiêu đề cân đối */}
            </View>

            {/* User Info */}
            <View style={styles.profileContainer}>
                <Image
                    source={require('../Image/user-out.png')} // Ảnh đại diện mẫu
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.userName}>Đỗ Trung Hiếu</Text>
                    <Text style={styles.email}>hieudtph35761@fpt.edu.vn</Text>
                </View>
            </View>

            {/* Menu Items */}
            <TouchableOpacity style={styles.menuItem}>
                <View>
                    <Text style={styles.menuText}>Đơn hàng của tôi</Text>
                    <Text style={styles.subText}>Đã có 10 đơn hàng</Text>
                </View>
                <Image source={require('../Image/shopping-bag.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
                <View>
                    <Text style={styles.menuText}>Địa chỉ giao hàng</Text>
                    <Text style={styles.subText}>03 Địa chỉ</Text>
                </View>
                <Image source={require('../Image/shopping-bag.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
                <View>
                    <Text style={styles.menuText}>Đánh giá của tôi</Text>
                    <Text style={styles.subText}>Đã đánh giá 5 mục</Text>
                </View>
                <Image source={require('../Image/shopping-bag.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
                <View>
                    <Text style={styles.menuText}>Cài đặt</Text>
                    <Text style={styles.subText}>Thông báo, Mật khẩu, FAQ, Liên hệ</Text>
                </View>
                <Image source={require('../Image/shopping-bag.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
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
        fontSize: 20,
        fontWeight: "bold",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginBottom: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "gray",
    },
    menuItem: {
        backgroundColor: "#f9f9f9",
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
});


export default ProfileScreen;
