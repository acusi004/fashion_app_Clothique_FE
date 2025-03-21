import {FlatList, RefreshControl, StyleSheet, Text, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {ActivityIndicator} from "react-native-paper";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ItemProducts from "./ItemProducts.tsx";

function ShirtScreen() {
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
export default ShirtScreen;
