import {FlatList, RefreshControl, StyleSheet, Text, View} from "react-native";
import {useCallback, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ItemProducts from "./ItemProducts.tsx";
import {ActivityIndicator} from "react-native-paper";
import AllProducts from "./AllProducts.tsx";

function DressScreen() {


    return (
        <View style={styles.container}>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    noData: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16
    }
})
export default DressScreen;
