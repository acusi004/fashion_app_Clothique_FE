// import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import axios from "axios";
import tokenService from "../service/tokenService";
import { jwtDecode } from "jwt-decode";
import { ActivityIndicator, TextInput } from "react-native-paper";
import Swiper from "react-native-swiper";
import TopTabNavigation from "../navigation/TopTabNavigation.tsx";
import { useEffect, useState } from "react";
import { searchProducts } from "../service/productService.";
import ItemSearchProducts from "./ItemSearchProducts.tsx";
import FilterDrawer from "../styles/FilterDrawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
// @ts-ignore
function HomeScreen({ navigation }) {
    const [userName, setUserName] = useState("Đang tải...");
    const [searchQuery, setSearchQuery] = useState("");
    const [productSearch, setProductSearch] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [filterActive, setFilterActive] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    // Banner images
    const banner: any[] = [
        require('../Image/banner.png'),
        require('../Image/banner2.png')
    ];

    useFocusEffect(
        useCallback(() => {
            fetchUserInfo(); // Gọi lại API khi quay lại HomeScreen
        }, [])
    );

    const fetchUserInfo = async () => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                console.error("❌ Không tìm thấy token!");
                return;
            }

            let decodedToken;
            try {
                decodedToken = jwtDecode(token);
            } catch (error) {
                console.error("❌ Lỗi khi giải mã token:", error);
                return;
            }

            const userEmail = decodedToken?.email;
            if (!userEmail) {
                console.error("❌ Không lấy được email từ token!");
                return;
            }

            // Gọi API để lấy thông tin user
            const response = await axios.get("http://10.0.2.2:5000/v1/user/info", {
                headers: { Authorization: `Bearer ${token}` },
                params: { email: userEmail }
            });

            // Cập nhật tên người dùng
            setUserName(response.data.name || "Người dùng");
        } catch (error) {
            console.error("❌ Lỗi khi lấy thông tin user:", error);
            setUserName("Lỗi tải tên");
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);


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
                return navigation.navigate("DetailScreen", { product: item });
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
                    <Text style={styles.boldText}>{userName}</Text>
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
                    style={[styles.TextInputHeader]}
                    mode="outlined"
                    placeholder="Bạn đang tìm kiếm gì?"
                    outlineColor="#F6F6F6"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    activeOutlineColor="#F6F6F6"
                    cursorColor="#000"

                />
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => {
                        setFilterActive(!filterActive);
                        handleOpenFilter()
                    }}
                >
                    <Image
                        style={styles.filterImage}
                        source={
                            filterActive
                                ? require("../Image/filter_Bold.png")
                                : require("../Image/filter.png")
                        }
                    />

                </TouchableOpacity>
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
                                    <Image source={image} style={styles.imageBanner} />
                                </View>
                            ))}
                        </Swiper>
                    </View>


                    <TopTabNavigation />

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
        marginLeft: 17
    },
    filterImage: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
});

export default HomeScreen;
