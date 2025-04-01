// import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
// import { useState } from "react";
import {ActivityIndicator, TextInput} from "react-native-paper";
import Swiper from "react-native-swiper";
import TopTabNavigation from "../navigation/TopTabNavigation.tsx";
import React, {useEffect, useState} from "react";
import {searchProducts} from "../service/productService.";
import ItemSearchProducts from "./ItemSearchProducts.tsx";
import FilterDrawer from "../styles/FilterDrawer";
import {useFocusEffect} from "@react-navigation/native";
import {getSearchHistory, saveSearchHistory} from "../service/searchHistoryService";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
function HomeScreen({navigation}) {

    const [searchQuery, setSearchQuery] = useState("");
    const [productSearch, setProductSearch] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [filterActive, setFilterActive] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const SEARCH_HISTORY_KEY = 'searchHistory';
    const [searchHistory, setSearchHistory] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);




    // Banner images
    const banner: any[] = [
        require('../Image/banner.png'),
        require('../Image/banner2.png')
    ];

    //chỉ chạy khi searchQuery thay đổi
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);
        getSearchHistory().then(setSearchHistory);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);


    //chạy khi màn hình quay trở lại
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setSearchQuery("");
                setProductSearch([]);
                setError("");
            };
        }, [])
    );

    // Mở Drawer
    const handleOpenFilter = () => {
        setShowFilter(true);

    };

    // Đóng Drawer
    const handleCloseFilter = () => {
        setShowFilter(false);
    };

    // Khi người dùng bấm "Áp dụng" trong Drawer

    // @ts-ignore
    const handleApplyFilter = (filters) => {
        console.log("Filters:", filters);
        // Ở đây bạn có thể gọi hàm search kèm filters hoặc tuỳ logic
        setShowFilter(false);
    };

    //  Hàm gọi API tìm kiếm sản phẩm (sử dụng hàm từ productService)
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);

        setError("");
        try {
            const data = await searchProducts(searchQuery);
            // ToastAndroid.show(`Data: ${data}`, ToastAndroid.SHORT);
            setProductSearch(data);
            const updatedHistory = await saveSearchHistory(searchQuery);
            setSearchHistory(updatedHistory); // cập nhật UI

        } catch (error) {
            // @ts-ignore
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const handleClearHistory = async () => {
        try {
            await AsyncStorage.removeItem('searchHistory');
            setSearchHistory([]);
        } catch (err) {
            console.error("Lỗi khi xoá lịch sử:", err);
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
            <TouchableOpacity
                onPress={() => navigation.navigate("SearchScreen")}
                style={styles.fakeSearchBox}
            >
                <Text style={styles.placeholderText}>Bạn đang tìm kiếm gì?</Text>
                <Image source={require('../Image/search.png')} style={styles.searchIcon} />
            </TouchableOpacity>

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
            )   : isSearchFocused && searchHistory.length > 0 ? (
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Lịch sử tìm kiếm:</Text>
                            <TouchableOpacity onPress={handleClearHistory}>
                                <Text style={{ color: 'red', fontSize: 14 }}>Xoá</Text>
                            </TouchableOpacity>
                        </View>

                        {searchHistory.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => setSearchQuery(item)}>
                                <Text style={{ paddingVertical: 6, fontSize: 16 }}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </>

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

                    <FilterDrawer
                        visible={showFilter}
                        onClose={handleCloseFilter}
                        onApply={handleApplyFilter}
                    />
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
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    TextInputHeader: {
        width: '90%',
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
    filterButton: {
        marginLeft:17
    },
    filterImage: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
        fakeSearchBox: {
            width: '100%',
            height: 45,
            borderRadius: 8,
            backgroundColor: '#F6F6F6',
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },

    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#000', // nếu bạn dùng icon trắng
        padding: 10,
        borderRadius: 0,
    },
});

export default HomeScreen;
