import { Alert, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { stylesChange } from "../styles/FilterDrawer";
import React, { useState } from "react";
import { Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import axios from "axios";
import CustomAlert from "../styles/CustomAlert.tsx";

// @ts-ignore
function ResetPasswordScreen({ route, navigation }) {
    const { token } = route.params; // ✅ lấy token từ route
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureText2, setSecureText2] = useState(true);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertHeader, setAlertHeader] = useState('');
    const [alertMessage, setAlertMessage] = useState('');


    // @ts-ignore
    const showAlert = (header, message) => {
        setAlertHeader(header);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const API_URL = "http://10.0.2.2:5000/v1/auth/reset-password";
    const handleCloseAlert = () => {
        setAlertVisible(false);
        if (alertHeader === 'Thành công' ) {
            navigation.navigate('LoginScreen');
        }
    };

    const handleReset = async () => {
        if (!newPassword || !confirmPassword) {
            return showAlert('Lỗi', 'Vui lòng nhập đầy đủ mật khẩu');
        }

        if (newPassword !== confirmPassword) {
            return showAlert('Lỗi', 'Mật khẩu không khớp');
        }

        setLoading(true);
        try {
            const res = await axios.post(API_URL, {
                token, // ✅ Gửi đúng theo backend
                newPassword,
            });

          showAlert('Thành công', res.data.message || 'Đặt lại mật khẩu thành công');

        } catch (error) {
            console.log('❌ Reset error:', error.response?.data);
           showAlert('Lỗi', error.response?.data?.message || error.response?.data?.error || 'Đặt lại mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={stylesChange.container}>
            <Text style={stylesChange.title}> {"\n"}Clothique</Text>

            <View style={stylesChange.inputContainer}>
                <TextInput
                    style={stylesChange.inputPassword}
                    placeholder="Mật khẩu mới"
                    secureTextEntry={secureText}
                    value={newPassword}
                    onChangeText={text => setNewPassword(text)}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={stylesChange.eyeIcon}>
                    <Image
                        source={secureText ? require("../Image/visibility.png") : require("../Image/hide.png")}
                        style={stylesChange.eyeImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={stylesChange.inputContainer}>
                <TextInput
                    style={stylesChange.inputPassword}
                    placeholder="Nhập lại Mật khẩu"
                    secureTextEntry={secureText2}
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                />
                <TouchableOpacity onPress={() => setSecureText2(!secureText2)} style={stylesChange.eyeIcon}>
                    <Image
                        source={secureText2 ? require("../Image/visibility.png") : require("../Image/hide.png")}
                        style={stylesChange.eyeImage}
                    />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <TouchableOpacity style={stylesChange.button} onPress={handleReset}>
                    <Text style={stylesChange.buttonText}>Đổi mật khẩu</Text>
                </TouchableOpacity>
            )}


            <CustomAlert
                visible={alertVisible}
                header={alertHeader}
                message={alertMessage}
                onClose={handleCloseAlert} // ✅ điều hướng chỉ khi thành công
            />
        </View>
    );
}

export default ResetPasswordScreen;
