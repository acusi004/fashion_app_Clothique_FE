import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView, Image } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import ChangePassScreen from "./ChangePassScreen.tsx";
import ChatScreen from "./ChatScreen.tsx";

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

function SettingScreen() {
    const navigation = useNavigation();

    // Danh sách FAQ
    const faqList = [
        { question: "Làm thế nào để thay đổi mật khẩu?", answer: "Bạn có thể thay đổi mật khẩu trong phần 'Cài đặt tài khoản'." },
        { question: "Làm thế nào để liên hệ với hỗ trợ?", answer: "Bạn có thể gửi email đến admin@gmail.com." },
        { question: "Tôi có thể xóa tài khoản của mình không?", answer: "Có, bạn có thể gửi yêu cầu xóa tài khoản đến Chủ cửa hàng." }
    ];

    // @ts-ignore
    return (
        <ScrollView style={styles.container}>
            {/* Header với nút Back */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require("../Image/back.png")} />
                </TouchableOpacity>
            </View>
            <Text style={styles.headerText}>Cài đặt</Text>

            {/* Phần FAQ */}
            <Text style={styles.sectionTitle}>FAQ - Câu hỏi thường gặp</Text>
            {faqList.map((item, index) => (
                <View key={index} style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
            ))}
            <View style={{marginTop: 5}}>
                <Text style={styles.sectionTitle}>Chức năng</Text>
                <MenuItem title="Đổi mật khẩu" subtitle="Đổi mật khẩu người dùng" iconSource={require("../Image/frame.png")} onPress={() => navigation.navigate(ChangePassScreen)} />
            </View>



        </ScrollView>
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
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
    headerText: {
        marginBottom: 30,
        marginLeft: 150,
        fontSize: 22,
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 20,
    },
    faqItem: {
        backgroundColor: "#f5f5f5",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: "bold",
    },
    faqAnswer: {
        fontSize: 14,
        color: "gray",
        marginTop: 5,
    },
    menuItem: {
        marginTop: 10,
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

export default SettingScreen;
