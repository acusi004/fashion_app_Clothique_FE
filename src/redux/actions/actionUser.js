// actionUser.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import tokenService from '../../service/tokenService';
import { API_URL } from '@env';


export const login = createAsyncThunk('user/login', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        // Lưu token vào AsyncStorage thông qua tokenService (xem phần Token Service bên dưới)
        await tokenService.setToken(response.data.accessToken);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || 'Đăng nhập không thành công');
    }
});
