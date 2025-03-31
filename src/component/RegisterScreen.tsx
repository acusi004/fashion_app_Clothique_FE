import React, { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image} from "react-native";
import RegisterService from "../service/RegisterService";
import {ActivityIndicator} from "react-native-paper";
import CheckBox from "@react-native-community/checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore
function RegisterScreen({navigation}) {

    const [email, setEmail]                   = useState('');
    const [password, setPassword]             = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading]               = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureText2, setSecureText2] = useState(true);

    // Hàm validate email: kiểm tra email có đúng định dạng
    // @ts-ignore
    const validateEmail = (mail) => {
        // Regex đơn giản kiểm tra định dạng email: có ký tự trước @, sau @, và sau dấu chấm
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(mail);
    };

    // Hàm validate mật khẩu:
    // - Ít nhất 8 ký tự
    // - Ký tự đầu tiên phải là chữ cái in hoa
    // - Có ít nhất 1 số và 1 ký tự đặc biệt (ví dụ: !@#$%^&*)
    // @ts-ignore
    const validatePassword = (pwd) => {
        const regex = /^(?=.{8,})(?=.*\d)(?=.*[!@#$%^&*])[A-Z][A-Za-z0-9!@#$%^&*]+$/;
        return regex.test(pwd);
    };


    const handleRegister = async () => {
        // Kiểm tra các trường thông tin đã được nhập chưa
        if ( !email || !password || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra định dạng email
        if (!validateEmail(email)) {
            Alert.alert('Lỗi', 'Email không hợp lệ, vui lòng kiểm tra lại!');
            return;
        }

        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu không khớp!');
            return;
        }
        // Kiểm tra định dạng mật khẩu
        if (!validatePassword(password)) {
            Alert.alert(
                'Lỗi',
                'Mật khẩu phải có ít nhất 8 ký tự, ký tự đầu viết hoa, có ít nhất 1 số và 1 ký tự đặc biệt (ví dụ: !@#$%^&*).'
            );
            return;
        }

        setLoading(true);
        try {
            const result = await RegisterService.register({ email, password });

            await AsyncStorage.setItem('hasLoggedInBefore', 'true');

            setLoading(true)
            setTimeout(() => {
                setLoading(false);
                navigation.navigate('LoginScreen'); // chuyển sang màn hình login sau 3 giây
            }, 3000);

        } catch (error) {

            console.error(error)
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Chào mừng đến {"\n"}Clothique</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType={"email-address"}
                />


           <View style={styles.inputContainer}>
               <TextInput
                   style={styles.inputPassword}
                   placeholder="Mật khẩu"
                   secureTextEntry={secureText}
                   value={password}
                   onChangeText={text => setPassword(text)}
               />
               <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                   <Image source={secureText ? require("../Image/visibility.png") : require("../Image/hide.png")}
                          style={styles.eyeImage}/>
               </TouchableOpacity>
           </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Nhập lại Mật khẩu"
                    secureTextEntry={secureText2}
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                />
                <TouchableOpacity onPress={() => setSecureText2(!secureText2)} style={styles.eyeIcon}>
                    <Image source={secureText2 ? require("../Image/visibility.png") : require("../Image/hide.png")}
                           style={styles.eyeImage}/>
                </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
                <TouchableOpacity>
                    <Text style={styles.footerText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                    <Text style={styles.footerText}>Đã có tài khoản.</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Đăng ký</Text>
                </TouchableOpacity>
            )}
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
