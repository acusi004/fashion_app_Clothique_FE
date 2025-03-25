// import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
// import { useState } from "react";
import {ActivityIndicator, TextInput} from "react-native-paper";
import Swiper from "react-native-swiper";
import TopTabNavigation from "../navigation/TopTabNavigation.tsx";
import {useEffect, useState} from "react";
import {searchProducts} from "../service/productService.";
import ItemSearchProducts from "./ItemSearchProducts.tsx";

// @ts-ignore
function HomeScreen({navigation}) {

    const [searchQuery, setSearchQuery] = useState("");
    const [productSearch, setProductSearch] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Banner images
    const banner: any[] = [
        require('../Image/banner.png'),
        require('../Image/banner2.png')
    ];

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    //  Hàm gọi API tìm kiếm sản phẩm (sử dụng hàm từ productService)
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        setError("");
        try {
            const data = await searchProducts(searchQuery);
            // ToastAndroid.show(`Data: ${data}`, ToastAndroid.SHORT);
            setProductSearch(data);
        } catch (error) {
            // @ts-ignore
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // @ts-ignore
    const renderSearchItem = ({ item }) => (
        <ItemSearchProducts
            item={item}
            onPress={(item: any) => {
                return navigation.navigate("DetailScreen", {product: item});
            }
            }
        />
    );

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
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    activeOutlineColor="#F6F6F6"
                    cursorColor="#000"
                />
            </View>
            {searchQuery.trim().length > 0 ? (
                <View style={styles.resultsContainer}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#27ae60" />
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        <FlatList
                            data={productSearch}
                            keyExtractor={(item) => item._id}
                            renderItem={renderSearchItem}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    Không tìm thấy sản phẩm nào
                                </Text>
                            }
                        />
                    )}
                </View>
            ) : (
                <>
                    <View style={styles.Banner}>
                        <Swiper autoplay={true} autoplayTimeout={3} showsPagination={false}>
                            {banner.map((image, index) => (
                                <View key={index} style={styles.slideBanner}>
                                    <Image source={image} style={styles.imageBanner}/>
                                </View>
                            ))}
                        </Swiper>
                    </View>


                    <TopTabNavigation/>
                </>
            )}





        </View>
    );
}

// StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,

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
        marginBottom: 20,
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
        width: "100%",
        height: 'auto'
    },
    resultsContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#888",
    },
    errorText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "red",
    },
    bannerContainer: {
        marginVertical: 20,
        height: 180,
        borderRadius: 10,
        overflow: "hidden",
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});

export default HomeScreen;
