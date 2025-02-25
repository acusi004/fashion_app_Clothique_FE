import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import DetailScreen from "./DetailScreen.tsx";
import {useState} from "react";





function NotificationScreen(){

    // luu size
    const [size, setSize] = useState('');
    const sz = [
        {id:0, Size: 'S'},
        {id:1, Size: 'M'},
        {id:2, Size: 'L'},
        {id:3, Size: 'XL'}
    ]
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.ImageItem} source={require('../Image/image1.png')}/>
                <TouchableOpacity style={styles.btnBackToHome}>
                    <Image source={require('../Image/back.png')} />
                </TouchableOpacity>
            </View>

            <View style={{paddingLeft:10, paddingRight:10}}>
                <View style={styles.headerChild}>
                    <Text style={styles.itemPrice}>199.000 VND</Text>
                    <Text style={styles.itemLuotBan}>Đã bán 39.1k</Text>
                </View>
                <View style={styles.body}>
                    <TouchableOpacity style={styles.btnPlus}>
                        <Image source={require('../Image/add.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.itemSoLuong}> 1 </Text>
                    <TouchableOpacity style={styles.btnMinus}>
                        <Image source={require('../Image/minus.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.bodyChild}>
                    {sz.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => setSize(item.Size)}
                            style={{
                                width:35,
                                height:35,
                                backgroundColor: size === item.Size ? '#D8D8D8' : '#D8D8D8',
                                borderRadius: 45,
                                alignItems:'center',
                                justifyContent:'center',
                                marginRight:5,

                            }}
                        >
                            <Text style={{ color: size === item.Size ? 'white' : 'black' }}>{item.Size}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.footer}>
                    <Text style={styles.itemTitle}>
                        Ao phong nam thu dong
                    </Text>
                    <View style={{padding:17}}>
                        <Text>
                            Chất liệu và Đặc điểm Nổi bật
                            Chất liệu cao cấp, giữ ấm hoàn hảo: len lông cừu, cotton dày dặn hoặc nỉ pha sợi tổng hợp giúp bảo vệ cơ thể khỏi cái lạnh nhưng vẫn thoáng khí.
                            Bề mặt vải mềm mại, co giãn nhẹ, mang lại cảm giác thoải mái và linh hoạt khi di chuyển.
                            Thiết kế Thời Thượng và Tinh Tế
                            Phong cách hiện đại với form dáng slim-fit hoặc oversize, tôn lên vóc dáng nam tính và mạnh mẽ.
                            Cổ áo tròn, cổ cao, hoặc cổ gập với chi tiết bo gọn ở tay áo và gấu áo giúp giữ ấm hiệu quả.
                            Các điểm nhấn như đường may tinh xảo, khóa kéo kim loại sang trọng, hoặc họa tiết tinh tế làm nổi bật gu thẩm mỹ cá nhân.

                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,

    },
    ImageItem:{

    }, btnBackToHome:{
        width:34,
        height:34,
        borderRadius:34,
        backgroundColor:'#BCB1B1',
        position:'absolute',
        left:10,
        top:3,
        alignItems:'center',
        justifyContent:'center'
    },

    header:{
        alignItems:'center',

    },
    headerChild:{
        flexDirection:'row',
        marginTop:20,
        justifyContent:'space-between'
    },
    itemSoSanPham:{
        marginLeft:80,
    },
    itemLuotBan:{
        marginLeft:10,
    },
    itemPrice:{
        fontWeight:'bold',
        fontSize:24

    }, body:{
        flexDirection:'row',
        marginTop:10

    },
    btnPlus:{
        borderStyle:'solid',
        borderWidth:3,
        borderRadius:15,
    },
    btnMinus:{
        borderStyle:'solid',
        borderWidth:3,
        borderRadius:15,
    },
    itemSoLuong:{
        marginLeft:15,
        marginRight:15,
        fontSize:16,

    },
    bodyChild:{
        flexDirection:'row',
        marginTop:10,
    },
    itemTitle:{
        fontWeight:'bold',
        fontSize:20,
    },
    footer:{
        marginTop:20,
    }


})



export default NotificationScreen;
