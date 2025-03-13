import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("../Image/logo.png")} style={styles.logo} />
            </View>
            <Text style={styles.title}>Clothique</Text>

            <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputPassword}
                        placeholder="Mật khẩu"
                        secureTextEntry={secureText}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                        <Image source={secureText ? require("../Image/visibility.png") : require("../Image/hide.png")} style={styles.eyeImage} />
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

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>


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