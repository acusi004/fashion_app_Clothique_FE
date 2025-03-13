import { StyleSheet, Text, View } from "react-native";

function TopTabNavigation() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Top Tab Navigation</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 50,
        backgroundColor: "#F2EDEB",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
    },
});

export default TopTabNavigation;
