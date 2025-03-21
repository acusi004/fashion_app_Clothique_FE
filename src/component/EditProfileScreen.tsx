import React, {useState} from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from "react-native";
import {useNavigation} from "@react-navigation/native";

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState("Đỗ Trung Hiếu");
    const [email, setEmail] = useState("hieudtph35761@fpt.edu.vn");
    const [phone, setPhone] = useState("0123456789");

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require("../Image/back.png")} style={styles.icon}/>
                </TouchableOpacity>
                <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
                <View style={{width: 28}}/>
            </View>

            {/* Ảnh đại diện */}
            <View style={styles.avatarContainer}>
                <Image source={require("../Image/user-out.png")} style={styles.avatar}/>
                <TouchableOpacity style={styles.editAvatar}>
                    <Image source={require("../Image/edit.png")} style={styles.icon}/>
                </TouchableOpacity>
            </View>

            {/* Form chỉnh sửa */}
            <View style={styles.form}>
                <Text style={styles.label}>Họ và tên</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName}/>

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address"/>

                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>
            </View>

            {/* Nút lưu */}
            <TouchableOpacity style={styles.saveButton}>
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
    editAvatar: {
        position: "absolute",
        bottom: 0,
        right: 10,
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 50,
        elevation: 3,
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
