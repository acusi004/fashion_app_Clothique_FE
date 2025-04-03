import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const ProfileResetPasswordScreen = () => {
    const navigation = useNavigation();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState("");

    const handleSendOTP = async () => {
        if (!email || email.trim() === "") {
            Alert.alert("Lỗi", "Vui lòng nhập email hợp lệ");
            return;
        }

        console.log("Email gửi đi:", email); // Kiểm tra email trước khi gửi

        try {
            const response = await axios.post("http://10.0.2.2:5000/v1/auth/send-otp", { email });
            Alert.alert("Thành công", response.data.message);
            setStep(2);
        } catch (error) {
            console.log("Lỗi gửi OTP:", error.response?.data);
            Alert.alert("Lỗi", error.response?.data?.error || "Gửi OTP thất bại");
        }
    };

    const handleVerifyOTP = async () => {
        console.log("Email:", email);
        console.log("OTP nhập vào:", code);

        try {
            const response = await axios.post("http://10.0.2.2:5000/v1/auth/verify-otp", { email, otp: code });
            Alert.alert("Thành công", response.data.message);
            setToken(response.data.token);
            setStep(3);
        } catch (error) {
            console.log("Lỗi xác thực OTP:", error.response?.data || error);
            Alert.alert("Lỗi", error.response?.data?.message || "Xác thực OTP thất bại");
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp");
            return;
        }

        try {
            const response = await axios.post("http://10.0.2.2:5000/v1/auth/reset-password", { token, newPassword });
            Alert.alert("Thành công", response.data.message);
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", error.response?.data?.message || "Đổi mật khẩu thất bại");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image source={require("../Image/back.png")} />
            </TouchableOpacity>
            <Text style={styles.title}>Đổi mật khẩu</Text>

            {step === 1 && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
                        <Text style={styles.buttonText}>Lấy mã</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 2 && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Mã xác nhận"
                        value={code}
                        onChangeText={setCode}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                        <Text style={styles.buttonText}>Gửi mã</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 3 && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Một mật khẩu mới"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập lại mật khẩu"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
    },
    backText: {
        fontSize: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ProfileResetPasswordScreen;
