import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import {TextInput} from "react-native-paper";
import Swiper from "react-native-swiper";
import TopTabNavigation from "../navigation/TopTabNavigation.tsx";
import {useState} from "react";






function HomeScreen(){

    //banner
    const banner = [
        require('../Image/banner.png'),
        require('../Image/banner2.png')
    ]
    return(
       <View style={styles.container}>
           <View style={styles.Header}>
                <Text>
                    Chào{'\n'}
                    <Text style={{fontWeight:'bold'}}>Hieu</Text>
                </Text>
               <Image
                   style={styles.ImageHeader}
                   source={require('../Image/shopping-cart.png')}/>
           </View>
           <View style={{marginTop:10}}>
               <TextInput
                   style={styles.TextInputHeader}
                   mode={"outlined"}
                   placeholder={'Bạn đang tìm kiếm gì?'}

                   outlineColor={'#F6F6F6'}
                   activeOutlineColor={'#F6F6F6'}
                   cursorColor={'#000'}
               />
           </View>
           <View style={styles.Banner}>
               <Swiper
                   autoplay={true}
                   autoplayTimeout={3}
                   showsPagination={false}
               >
                   {banner.map((image, index) => (
                       <View key={index} style={styles.slideBanner}>
                           <Image source={image} style={styles.imageBanner} />
                       </View>
                   ))}
               </Swiper>

           </View>
           <View style={styles.Body}>

           </View>


       </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:30,

    },
    Header:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    ImageHeader:{

    }, TextInputHeader:{
        width:'100%',
        height:45,
        borderRadius:30,
        backgroundColor:'#F6F6F6',


    },
    Banner:{
        width:'100%',
        height: 180,
        marginTop:20,
    },
    slideBanner: {
        borderRadius: 20,
        overflow: "hidden",
        marginTop: 20
    },
    imageBanner: {
        width: "100%",
        borderRadius: 20
    },
    Body:{
        marginTop:10,

    },
    listCategories:{


    }


})

export default HomeScreen;
