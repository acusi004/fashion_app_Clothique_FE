import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// @ts-ignore
const ChoseScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            {/* Phần trên của màn hình */}
            <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Kiến tạo{"\n"}Thời trang{"\n"}bằng{"\n"}Nghệ thuật</Text>
            </View>

            {/* Phần dưới cùng của màn hình */}
            <View style={styles.footerContainer}>
                {/* Nút Đăng kí điều hướng đến RegisterScreen */}
                <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")} style={styles.button}>
                    <Text style={styles.buttonLabel}>Đăng kí</Text>
                </TouchableOpacity>
                {/* Nút Đăng nhập điều hướng đến LoginScreen */}
                <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={styles.buttonRight}>
                    <Text style={styles.buttonLabelRight}>Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ChoseScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        marginTop: 400,
        marginRight: 180,
        fontSize: 38,
        fontWeight: 'bold',
        fontFamily: 'Inria Serif',
        marginBottom: 10,
        textAlign: 'left',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 100,
        paddingHorizontal: 23,
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    button: {
        borderWidth: 1,
        borderColor: "black",
        paddingVertical: 19,
        paddingHorizontal: 43,
        borderRadius: 20,
        marginHorizontal: 23,
    },
    buttonLabel: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonRight: {
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'white',
        paddingVertical: 19,
        paddingHorizontal: 43,
        borderRadius: 20,
        marginHorizontal: 23,
    },
    buttonLabelRight: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
