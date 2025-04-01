import {StyleSheet, View, Image} from "react-native";
import {useEffect} from "react";
import LoginScreen from "./LoginScreen.tsx";
import ChoseScreen from "./ChoseScreen.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore
function WelcomeScreen({navigation}) {

    useEffect(() => {
        const checkLoginStatus = async () => {
            const hasLoggedInBefore = await AsyncStorage.getItem('hasLoggedInBefore');

            setTimeout(() => {
                if (hasLoggedInBefore === 'true') {
                    navigation.navigate("LoginScreen"); // 👉 Chuyển thẳng vào Login nếu đã từng login
                } else {
                    navigation.navigate("ChoseScreen"); // 👉 Nếu chưa thì vào màn hình chọn
                }
            }, 3000);
        };

        checkLoginStatus();
    }, []);


    return (
        <View style={styles.container}>
            {/* Hiển thị Logo */}
            <Image
                source={require("../Image/logo.png")}
                style={styles.logo}
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
    },
    logo: {
        width: 430,
        height: 431,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        color: "#333",
        fontWeight: "bold",
    },
});

export default WelcomeScreen;
