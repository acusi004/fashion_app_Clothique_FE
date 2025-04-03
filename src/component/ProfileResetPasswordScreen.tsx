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
    const [secureText, setSecureText] = useState(true);
    const [secureText2, setSecureText2] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const validatePassword = (password) => {
        if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
        if (!/[A-Z]/.test(password)) return "Mật khẩu phải có ít nhất một chữ in hoa";
        if (!/[0-9]/.test(password)) return "Mật khẩu phải có ít nhất một số";
        if (!/[!@#$%^&*]/.test(password)) return "Mật khẩu phải có ít nhất một ký tự đặc biệt";
        return "";
    };

    const handleSendOTP = async () => {
        if (!email || email.trim() === "") {
            Alert.alert("Lỗi", "Vui lòng nhập email hợp lệ");
            return;
        }

        console.log("Email gửi đi:", email); 

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
        const validationError = validatePassword(newPassword);
        if (newPassword !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp");
            return;
        }

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const response = await axios.post("http://10.0.2.2:5000/v1/auth/reset-password", { token, newPassword });
            Alert.alert("Thành công", response.data.message);
            navigation.replace("LoginScreen")
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
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputN}
                            placeholder="Một mật khẩu mới"
                            secureTextEntry={secureText}
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                setErrorMessage("");
                            }}
                        />
                        <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                            <Image source={secureText ? require("../Image/visibility.png") : require("../Image/hide.png")} style={styles.eyeImage} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputN}
                            placeholder="Nhập lại mật khẩu"
                            secureTextEntry={secureText2}
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setErrorMessage("");
                            }}
                        />
                        <TouchableOpacity onPress={() => setSecureText2(!secureText2)} style={styles.eyeIcon}>
                            <Image source={secureText2 ? require("../Image/visibility.png") : require("../Image/hide.png")} style={styles.eyeImage} />
                        </TouchableOpacity>
                    </View>

                    {errorMessage !== "" && <Text style={styles.errorText}>{errorMessage}</Text>}

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
    eyeImage: {
        width: 24,
        height: 24,
    },
    eyeIcon: {
        padding: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 50,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#F8F9FA",
    },
    inputN: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
        textAlign: "center",
    },
});

export default ProfileResetPasswordScreen;
