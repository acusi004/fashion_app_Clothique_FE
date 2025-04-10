import { useNavigation } from "@react-navigation/native";
import React from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native";

// @ts-ignore
const FailedScreen = ({navigation}) => {

    return (
        <View style={styles.container}>
            {/* Tiêu đề */}
            <Text style={styles.title}>Thông báo</Text>

            {/* Icon Check */}
            <View>
                <Image source={require("../Image/credit-card.png")} style={styles.icon}/>
            </View>

            {/* Nội dung thông báo */}
            <Text style={styles.message}>
                Bạn đã hủy thanh toán, vui lòng truy cập đơn hàng để tiếp tục giao dịch !
            </Text>

            {/* Nút quay lại trang chủ */}
           <View style={{width:'100%', flexDirection:'row', justifyContent:'space-around'}}>
               <TouchableOpacity
                   style={styles.button}
                   onPress={()=>navigation.reset({
                       index: 0, // Màn hình đầu tiên sau khi reset
                       routes: [{ name: 'BottomNavigation' }], // Điều hướng tới HTScreen
                   })}>
                   <Text style={styles.buttonText}>Quay lại trang chủ</Text>
               </TouchableOpacity>
               <TouchableOpacity
                   style={styles.button}
                   onPress={()=>navigation.navigate('OrderScreen')}>
                   <Text style={styles.buttonText}>Xem đơn hàng</Text>
               </TouchableOpacity>
           </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },

    icon: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        color: "#555",
        marginBottom: 30,
    },
    button: {
        borderWidth: 1,
        borderColor: "#000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        width:190,
        alignItems:'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default FailedScreen;
