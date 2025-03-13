import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import DetailScreen from "./DetailScreen.tsx";
import {useState} from "react";

function NotificationScreen(){

    const notifications = [
        {
            id: "1",
            title: "Your order #123456789 has been confirmed",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis pretium et in arcu adipiscing nec.",
            image: "https://cdn0199.cdn4s.com/media/o%20ph%C3%B4ng%20c%E1%BB%99c%20tay/275270794_508218257533241_3115723458973560039_n.jpg", // Ảnh minh họa
            isNew: true,
        },
        {
            id: "2",
            title: "Your order #123456789 has been canceled",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis pretium et in arcu adipiscing nec.",
            image: "https://cdn0199.cdn4s.com/media/o%20ph%C3%B4ng%20c%E1%BB%99c%20tay/275543008_445549064014327_1189472481875048791_n.jpg",
            isNew: false,
        },
    ];

    return(
           <View style={styles.container}>
               <Text style={styles.header}>Thông báo</Text>

               <FlatList
                   data={notifications}
                   keyExtractor={(item) => item.id}
                   renderItem={({ item }) => (
                       <View style={styles.card}>
                           <Image source={{ uri: item.image }} style={styles.image} />
                           <View style={styles.textContainer}>
                               <Text style={styles.title}>{item.title}</Text>
                               <Text style={styles.description}>{item.description}</Text>
                           </View>
                           {item.isNew && <Text style={styles.newBadge}>New</Text>}
                       </View>
                   )}
               />
           </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#f8f8f8",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: "center",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    description: {
        fontSize: 12,
        color: "#666",
    },
    newBadge: {
        fontSize: 12,
        fontWeight: "bold",
        color: "red",
    },
});




export default NotificationScreen;
