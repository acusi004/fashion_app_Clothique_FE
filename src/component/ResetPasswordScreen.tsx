import React, { useState } from "react";
import {
    TextInput,
    TouchableOpacity,
    Text,
    View,
    Modal,
    StyleSheet,
    Image,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { stylesChange } from "../styles/FilterDrawer";

// @ts-ignore
function ResetPasswordScreen({ route, navigation }) {
    const { token } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureText2, setSecureText2] = useState(true);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertHeader, setAlertHeader] = useState('');

    const API_URL = "http://10.0.2.2:5000/v1/auth/reset-password";

    // @ts-ignore
    const showAlert = (header, message) => {
        setAlertHeader(header);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handleReset = async () => {
        if (!newPassword || !confirmPassword) {
            return showAlert("Lỗi", "Vui lòng nhập đầy đủ mật khẩu");
        }
        if (newPassword !== confirmPassword) {
            return showAlert("Lỗi", "Mật khẩu không khớp");
        }

        setLoading(true);
        try {
            const res = await axios.post(API_URL, {
                token,
                newPassword,
            });
            showAlert("Thành công", res.data.message || "Đặt lại mật khẩu thành công");
        } catch (error) {
            const err = error as any;
            console.log("❌ Reset error:", err.response?.data);
            showAlert("Lỗi", err.response?.data?.message || err.response?.data?.error || "Đặt lại mật khẩu thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={stylesChange.container}>
            <Text style={stylesChange.title}>{"\n"}Clothique</Text>

            <View style={stylesChange.inputContainer}>
                <TextInput
                    style={stylesChange.inputPassword}
                    placeholder="Mật khẩu mới"
                    secureTextEntry={secureText}
                    value={newPassword}
                    onChangeText={text => setNewPassword(text)}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={stylesChange.eyeIcon}>
                    <Image source={secureText ? require("../Image/visibility.png") : require("../Image/hide.png")} style={stylesChange.eyeImage} />
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
                    <Image source={secureText2 ? require("../Image/visibility.png") : require("../Image/hide.png")} style={stylesChange.eyeImage} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <TouchableOpacity style={stylesChange.button} onPress={handleReset}>
                    <Text style={stylesChange.buttonText}>Đổi mật khẩu</Text>
                </TouchableOpacity>
            )}

            {/* Custom Alert */}
            <Modal transparent visible={alertVisible} animationType="fade">
                <View style={customStyles.overlay}>
                    <View style={customStyles.alertContainer}>
                        <View style={customStyles.iconWrapper}>
                            <MaterialIcons name="info" size={28} color="#fff" />
                        </View>

                        <Text style={customStyles.header}>{alertHeader}</Text>
                        <Text style={customStyles.message}>{alertMessage}</Text>

                        <TouchableOpacity
                            style={customStyles.button}
                            onPress={() => {
                                setAlertVisible(false);
                                if (alertHeader === "Thành công") {
                                    navigation.navigate("LoginScreen");
                                }
                            }}>
                            <Text style={customStyles.buttonText}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
const customStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: 260,
        alignItems: 'center',
        position: 'relative',
    },
    iconWrapper: {
        position: 'absolute',
        top: -30,
        backgroundColor: '#5b5d6b',
        padding: 15,
        borderRadius: 50,
    },
    header: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#5b5d6b',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ResetPasswordScreen;
