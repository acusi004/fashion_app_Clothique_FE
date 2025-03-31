import {Alert, Image, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import {ActivityIndicator} from "react-native-paper";
import React, {useState} from "react";
import {stylesChange} from "../styles/FilterDrawer";

import axios from "axios";

// @ts-ignore
function ChangePassScreen({navigation}){

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = "http://10.0.2.2:5000/v1/auth/send-otp"

    const handleSendEmail = async () => {
        ToastAndroid.show(`emaiL: ${email}`, ToastAndroid.SHORT);
        if (!email) return Alert.alert('Thông báo', 'Vui lòng nhập email');
        setLoading(true);
        try {
            const res = await axios.post(API_URL, { email });
            Alert.alert('Thành công', res.data.message);
             navigation.navigate('VerifyOtpScreen', { email });
        } catch (error: any) {
            Alert.alert(
                'Lỗi',
                error.response?.data?.message || error.response?.data?.error || `Gửi OTP thất bại: ${email}`
            );

        } finally {
            setLoading(false);
        }
    };



    return(
        <View style={{ justifyContent:'center', flex:1, padding:10 }}>

           <View style={styles.inputContainer}>
               <TextInput
                   style={styles.input}
                   placeholder="Email"
                   value={email}
                   onChangeText={text => setEmail(text)}
               />
           </View>


            <TouchableOpacity style={styles.button} onPress={handleSendEmail} >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Gửi mã OTP</Text>}
            </TouchableOpacity>

        </View>
    )
}

const  styles = StyleSheet.create({
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

})

export default ChangePassScreen;
