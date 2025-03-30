// src/service/searchHistoryService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = 'searchHistory';

// Lưu từ khóa vào lịch sử
export const saveSearchHistory = async (query) => {
    try {
        const existing = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        let history = existing ? JSON.parse(existing) : [];

        // Đưa từ khóa lên đầu, loại bỏ trùng lặp
        history = [query, ...history.filter(item => item !== query)];

        // Giới hạn 5 từ gần nhất
        if (history.length > 5) history = history.slice(0, 5);

        await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
        return history;
    } catch (err) {
        console.error("Lỗi khi lưu lịch sử tìm kiếm:", err);
        return [];
    }
};

// Lấy danh sách từ khóa lịch sử
export const getSearchHistory = async () => {
    try {
        const existing = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        return existing ? JSON.parse(existing) : [];
    } catch (err) {
        console.error("Lỗi khi lấy lịch sử tìm kiếm:", err);
        return [];
    }
};

// Xoá toàn bộ lịch sử tìm kiếm
export const clearSearchHistory = async () => {
    try {
        await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (err) {
        console.error("Lỗi khi xoá lịch sử tìm kiếm:", err);
    }
};

