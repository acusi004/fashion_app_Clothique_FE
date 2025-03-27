import tokenService from "../service/tokenService";

const BASE_URL = "http://10.0.2.2:5000";


export const addToCartAPI = async (productId,variantId) => {
    const token = await tokenService.getToken();
    if (!token) {
        throw new Error("Chưa có token, vui lòng đăng nhập trước.");
    }

    // Gọi lên API /v1/cart/add-cart (thay bằng endpoint của bạn)
    const response = await fetch(`${BASE_URL}/v1/cart/add-to-cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            productId,
            variantId
        }),
    });

    // Xử lý lỗi
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
    }

    // Trả về kết quả
    const addedItem = await response.json();
    return addedItem;
};

export const fetchCartData = async () => {
    const token = await tokenService.getToken();
    if (!token) {
        throw new Error("Chưa có token, vui lòng đăng nhập trước.");
    }
    const response = await fetch(`${BASE_URL}/v1/cart/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error("Lỗi 401: Token không hợp lệ hoặc đã hết hạn.");
    }

    const data = await response.json();
    return data.cart || [];
};

export const deleteCartItemAPI = async (cartId) => {
    const token = await tokenService.getToken();
    if (!token) {
        throw new Error("Chưa có token, vui lòng đăng nhập trước.");
    }

    const response = await fetch(`${BASE_URL}/v1/cart/delete-cart/${cartId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
    }

    return true;
};

export const updateCartItemAPI = async (cartId, quantity) => {
    const token = await tokenService.getToken();
    if (!token) {
        throw new Error("Chưa có token, vui lòng đăng nhập trước.");
    }

    const response = await fetch(`${BASE_URL}/v1/cart/update-cart`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItemId: cartId, quantity }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
    }

    const updatedItem = await response.json();
    return updatedItem;
};
