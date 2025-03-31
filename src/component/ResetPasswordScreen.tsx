import {Alert, TextInput, TouchableOpacity} from "react-native";
import {Text, View } from "react-native";
import { stylesChange } from "../styles/FilterDrawer";
import { useState } from "react";
import { Image } from "react-native";
import {ActivityIndicator} from "react-native-paper";
import axios from "axios";

// @ts-ignore
function ResetPasswordScreen({ route, navigation }){


    const { email, otp } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading]               = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureText2, setSecureText2] = useState(true);

    const API_URL = "http://10.0.2.2:5000/v1/auth/reset-password"

    const handleReset = async () => {
        if (newPassword !== confirmPassword) return Alert.alert('Lỗi', 'Mật khẩu không khớp');
        try {
            const res = await axios.post(API_URL, {
                email,
                otp,
                newPassword,
            });
            Alert.alert('Thành công', res.data.message || 'Đặt lại mật khẩu thành công');
            navigation.navigate('LoginScreen');
        } catch (error) {
            Alert.alert('Lỗi', (error as any).response?.data?.message || 'Đặt lại mật khẩu thất bại');
        }
    };


    return(
        <View style={stylesChange.container}>
            <Text style={stylesChange.title}> {"\n"}Clothique</Text>



            <View style={stylesChange.inputContainer}>
                <TextInput
                    style={stylesChange.inputPassword}
                    placeholder="Mật khẩu mới"
                    secureTextEntry={secureText}
                    value={newPassword}
                    onChangeText={text => setNewPassword(text)}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={stylesChange.eyeIcon}>
                    <Image source={secureText ? require("../Image/visibility.png") : require("../Image/hide.png")}
                           style={stylesChange.eyeImage}/>
                </TouchableOpacity>
            </View>

            <View style={stylesChange.inputContainer}>
                <TextInput
                    style={stylesChange.inputPassword}
                    placeholder="Nhập lại Mật khẩu"
                    secureTextEntry={secureText2}
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                />
                <TouchableOpacity onPress={() => handleReset()} style={stylesChange.eyeIcon}>
                    <Image source={secureText2 ? require("../Image/visibility.png") : require("../Image/hide.png")}
                           style={stylesChange.eyeImage}/>
                </TouchableOpacity>

            </View>


            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <TouchableOpacity style={stylesChange.button} >
                    <Text style={stylesChange.buttonText}>Đổi mật khẩu</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default ResetPasswordScreen;
