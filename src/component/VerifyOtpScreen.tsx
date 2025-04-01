import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import React, { useState } from "react";
import axios from "axios";

// @ts-ignore
function VerifyOtpScreen({ route, navigation }) {
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = "http://10.0.2.2:5000/v1/auth/verify-otp";

    const handleVerifyOtp = async () => {
        if (!otp) return Alert.alert('Lỗi', 'Vui lòng nhập mã OTP');
        setLoading(true);
        try {
            const res = await axios.post(API_URL, { email, otp });

            // ✅ Nhận token từ backend
            const token = res.data.token;

            if (!token) {
                throw new Error("Không nhận được token từ server.");
            }

            Alert.alert('Thành công', res.data.message || 'Xác thực OTP thành công');
            navigation.navigate('ResetPasswordScreen', { token }); // ✅ Truyền token
        } catch (error: any) {
            console.log('❌ OTP Verify Error:', error.response?.data);
            Alert.alert('Lỗi', error.response?.data?.message || error.response?.data?.error || 'Xác thực OTP thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ justifyContent: 'center', flex: 1, padding: 10 }}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="OTP của bạn"
                    value={otp}
                    onChangeText={text => setOtp(text)}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.buttonText}>Xác thực OTP</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#000",
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
        borderRadius: 25,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
    input: {
        flex: 1,
    }
});

export default VerifyOtpScreen;
