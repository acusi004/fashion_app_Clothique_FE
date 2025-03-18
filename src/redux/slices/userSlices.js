// userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { login } from '../actions/actionUser';

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.accessToken;
                state.user = action.payload; // Có thể chứa thông tin chi tiết người dùng
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
