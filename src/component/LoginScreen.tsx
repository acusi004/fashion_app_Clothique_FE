import React, {useState} from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from "react-native";
import BottomNavigation from "../navigation/BottomNavigation.tsx";
import authService from "../service/authService";
import {ActivityIndicator} from "react-native-paper";

// @ts-ignore
function LoginScreen({navigation}) {
    const [username, setUsername] = useState('');  // Biến username thay vì email
    const [password, setPassword] = useState('');  // Biến password
    const [secureText, setSecureText] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        console.log('Username:', username);  // Log giá trị username
        console.log('Password:', password);  // Log giá trị password

        // Kiểm tra xem username và password có hợp lệ hay không
        if (!username || username.trim() === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập email');
            return;
        } else if (!password || password.trim() === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
            console.log('pass' + password)
            return;
        } else {
            try {
                // Gọi hàm loginUser từ authService
                const result = await authService.loginUser(username, password);

                // Nếu thành công điều hướng sang màn hình Home
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    navigation.navigate('BottomNavigation'); // chuyển sang màn hình chính sau 3 giây
                }, 3000);


            } catch (error) {
                // Tuỳ vào error trả về từ backend, bạn hiển thị phù hợp
                Alert.alert('Đăng nhập thất bại');

                console.error(error);
            }
        }


    }


    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("../Image/logo.png")} style={styles.logo}/>
            </View>
            <Text style={styles.title}>Clothique</Text>

            <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={username}
                        onChangeText={text => setUsername(text)}
                    />
                </View>

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
                <View style={styles.footerContainer}>
                    <TouchableOpacity>
                        <Text style={styles.footerText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
                        <Text style={styles.footerText}>Tạo tài khoản</Text>
                    </TouchableOpacity>
                </View>
            </View>


            {loading ? (
                <ActivityIndicator size="large" color="#000"/>
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Đăng nhập</Text>
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
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 170,
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
    },
    inputPassword: {
        flex: 1,
    },
    eyeIcon: {
        padding: 10,
    },
    eyeImage: {
        width: 24,
        height: 24,
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
        borderRadius: 25,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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

export default LoginScreen;
