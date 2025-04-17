import axios from 'axios';
import { getToken } from './categoryService';
const BASE_URL = 'http://10.0.2.2:5000/v1/comment';

export const likeComment = async (commentId) => {
    const token = await getToken();
    return axios.patch(`${BASE_URL}/like/${commentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const dislikeComment = async (commentId) => {
    const token = await getToken();
    return axios.patch(`${BASE_URL}/dislike/${commentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

