import { StyleSheet, View, Image } from "react-native";
import { useEffect } from "react";

// @ts-ignore
function WelcomeScreen({ navigation }) {

    useEffect(() => {
        // Sau 3 giây, tự động chuyển sang màn hình Home
        const timer = setTimeout(() => {
            navigation.replace("BottomNavigation");
        }, 3000);

        return () => clearTimeout(timer);
    }
    );

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
