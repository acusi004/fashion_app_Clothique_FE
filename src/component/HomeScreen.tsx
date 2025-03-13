// import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useState } from "react";
import { TextInput } from "react-native-paper";
import Swiper from "react-native-swiper";

// @ts-ignore
function HomeScreen({ navigation }) {

    // Banner images
    const banner: any[] = [
        require('../Image/banner.png'),
        require('../Image/banner2.png')
    ];

    // Chuyển đến giỏ hàng
    const navigateCart = () => {
        navigation.navigate("CartScreen");
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.Header}>
                <Text style={styles.welcomeText}>
                    Chào,{'\n'}
                    <Text style={styles.boldText}>Hieu</Text>
                </Text>
                <TouchableOpacity onPress={navigateCart}>
                    <Image
                        style={styles.ImageHeader}
                        source={require('../Image/shopping-cart.png')}
                    />
                </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.TextInputHeader}
                    mode="outlined"
                    placeholder="Bạn đang tìm kiếm gì?"
                    outlineColor="#F6F6F6"
                    activeOutlineColor="#F6F6F6"
                    cursorColor="#000"
                />
            </View>

            {/* Banner */}
            <View style={styles.Banner}>
                <Swiper autoplay={true} autoplayTimeout={3} showsPagination={false}>
                    {banner.map((image, index) => (
                        <View key={index} style={styles.slideBanner}>
                            <Image source={image} style={styles.imageBanner} />
                        </View>
                    ))}
                </Swiper>
            </View>

            {/* Nội dung chính */}
            <View style={styles.Body}>
                {/* Nội dung sẽ được thêm sau */}
            </View>
        </View>
    );
}

// StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
        backgroundColor: "#fff",
    },
    Header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 18,
        color: "#000",
    },
    boldText: {
        fontWeight: 'bold',
    },
    ImageHeader: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    searchContainer: {
        marginTop: 10,
    },
    TextInputHeader: {
        width: '100%',
        height: 45,
        borderRadius: 30,
        backgroundColor: '#F6F6F6',
        paddingHorizontal: 15,
    },
    Banner: {
        width: '100%',
        height: 180,
        marginTop: 20,
    },
    slideBanner: {
        borderRadius: 20,
        overflow: "hidden",
    },
    imageBanner: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
        resizeMode: "cover",
    },
    Body: {
        marginTop: 10,
    },
});

export default HomeScreen;
