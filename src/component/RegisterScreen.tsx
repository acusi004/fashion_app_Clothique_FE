import React, {useRef, useState} from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image} from "react-native";
import RegisterService from "../service/RegisterService";
import {ActivityIndicator} from "react-native-paper";
import CheckBox from "@react-native-community/checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../styles/CustomAlert.tsx";

// @ts-ignore
function RegisterScreen({navigation}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureText2, setSecureText2] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState('');

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertHeader, setAlertHeader] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmRef = useRef<TextInput>(null);

    const showAlert = (header: string, message: string, focusRef: React.RefObject<TextInput> | null = null) => {
        setAlertHeader(header);
        setAlertMessage(message);
        setAlertVisible(true);

        if (focusRef) {
            setTimeout(() => {
                focusRef.current?.focus();
            }, 500);
        }
    };

    // @ts-ignore
    const validateEmail = (mail) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(mail);
    };

    // @ts-ignore
    const getPasswordStrength = (pwd) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[!@#$%^&*]/.test(pwd)) strength++;

        if (strength <= 1) return "Yếu";
        if (strength === 2 || strength === 3) return "Trung bình";
        return "Mạnh";
    };

    // @ts-ignore
    const handlePasswordChange = (text) => {
        setPassword(text);
        setPasswordStrength(getPasswordStrength(text));
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            // @ts-ignore
            showAlert("Lỗi", "Vui lòng điền đầy đủ thông tin!", !email ? emailRef : !password ? passwordRef : confirmRef);
            return;
        }

        if (!validateEmail(email)) {
            // @ts-ignore
            showAlert("Lỗi", "Email không hợp lệ! Ví dụ: abc@gmail.com", emailRef);
            return;
        }

        if (password.length < 8) {
            // @ts-ignore
            showAlert("Lỗi", "Mật khẩu phải có ít nhất 8 ký tự!", passwordRef);
            return;
        }

        if (!/^[A-Z]/.test(password)) {
            // @ts-ignore
            showAlert("Lỗi", "Mật khẩu phải bắt đầu bằng chữ in hoa!", passwordRef);
            return;
        }

        if (!/\d/.test(password)) {
            // @ts-ignore
            showAlert("Lỗi", "Mật khẩu phải chứa ít nhất 1 số!", passwordRef);
            return;
        }

        if (!/[!@#$%^&*]/.test(password)) {
            // @ts-ignore
            showAlert("Lỗi", "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)", passwordRef);
            return;
        }

        if (password !== confirmPassword) {
            // @ts-ignore
            showAlert("Lỗi", "Mật khẩu nhập lại không khớp!", confirmRef);
            return;
        }

        setLoading(true);
        try {
            await RegisterService.register({ email, password });
            await AsyncStorage.setItem('hasLoggedInBefore', 'true');

            showAlert("Thành công", "Đăng ký thành công!", null);
            setTimeout(() => {
                setLoading(false);
                navigation.navigate("LoginScreen");
            }, 2000);
        } catch (error) {
            showAlert("Đăng ký thất bại", "Email đã tồn tại hoặc có lỗi xảy ra.");
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chào mừng đến {"\n"}Clothique</Text>

            <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <View style={styles.inputContainer}>
                <TextInput
                    ref={passwordRef}
                    style={styles.inputPassword}
                    placeholder="Mật khẩu"
                    secureTextEntry={secureText}
                    value={password}
                    onChangeText={handlePasswordChange}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                    <Image source={secureText ? require("../Image/visibility.png") : require("../Image/hide.png")} style={styles.eyeImage} />
                </TouchableOpacity>
            </View>

            {password !== '' && (
                <Text style={{ alignSelf: 'flex-start', color: passwordStrength === 'Mạnh' ? 'green' : passwordStrength === 'Trung bình' ? 'orange' : 'red', marginBottom: 5 }}>
                    Độ mạnh mật khẩu: {passwordStrength}
                </Text>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    ref={confirmRef}
                    style={styles.inputPassword}
                    placeholder="Nhập lại Mật khẩu"
                    secureTextEntry={secureText2}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setSecureText2(!secureText2)} style={styles.eyeIcon}>
                    <Image source={secureText2 ? require("../Image/visibility.png") : require("../Image/hide.png")} style={styles.eyeImage} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text style={styles.footerText}>Đã có tài khoản?</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Đăng ký</Text>
                </TouchableOpacity>
            )}

            <CustomAlert
                visible={alertVisible}
                header={alertHeader}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        textAlign: "left",
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 200,
    },
    input: {
        backgroundColor: "#FFFBFB",
        width: "100%",
        height: 50,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    inputContainer: {
        backgroundColor: "#FFFBFB",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 50,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
        borderRadius: 25,
        marginTop: 70,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    inputWrapper: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#000",
        marginBottom: 40,
    },
    eyeImage: {
        width: 24,
        height: 24,
    },
    eyeIcon: {
        padding: 10,
    },
    inputPassword: {
        flex: 1,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 15,
    },
    footerText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold"
    },

});


export default RegisterScreen;
