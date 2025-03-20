import {FlatList, Text, ToastAndroid, View} from "react-native";
import {useEffect, useState} from "react";
import axios from "axios";
import ItemProducts from "./ItemProducts.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore
function AllProducts({navigation}) {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);



    const getToken = async () => {
        try {
            return await AsyncStorage.getItem('accessToken');
        } catch (error) {
            console.error('Lỗi khi lấy token:', error);
            return null;
        }
    };

    const fetchProducts = async () => {
        try {
            const token = await getToken();
            if (!token) {
                console.log('Chưa đăng nhập, không lấy được dữ liệu sản phẩm');
                setLoading(false);
                // Bạn có thể chuyển hướng người dùng sang màn hình đăng nhập nếu cần:
                // navigation.navigate('Login');
                return;
            }

            const response = await axios.get('http://10.0.2.2:5000/v1/product', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {

            console.error(
                'Lỗi khi lấy dữ liệu sản phẩm:', error
            );
            setLoading(false);
        }
    };




    // Hàm chọn ngẫu nhiên một hình ảnh từ mảng variants
    // @ts-ignore
    const getRandomImage = (variants) => {
        if (variants && variants.length > 0) {
            const randomVariant = variants[Math.floor(Math.random() * variants.length)];
            return randomVariant.images && randomVariant.images.length > 0
                ? randomVariant.images[0]
                : null;
        }
        return null;
    };

    // Hàm xử lý khi click vào item, chuyển sang màn hình chi tiết và truyền data
    // @ts-ignore
    const handlePressItem = (product) => {
        navigation.navigate('DetailScreen', { product });
    };

    // @ts-ignore
    const renderItem = ({ item }) => (
        <ItemProducts
            product={item}
            getRandomImage={getRandomImage}
            onPress={handlePressItem}
        />
    );


    // @ts-ignore
    return (
        <View style={{width:'auto', height:'auto'}}>
            {loading ? (
                <Text>Đang tải...</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    numColumns={2}  // Số cột hiển thị là 2
                    columnWrapperStyle={{ justifyContent: 'space-around' }} // Điều chỉnh canh giữa các cột
                />
            )}

        </View>
    );
}
export default AllProducts;
