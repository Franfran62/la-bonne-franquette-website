import {useAuthTokenStore, useRefreshTokenStore} from "@/stores/authToken";
import {post} from "@/services/axiosService.js";

const _login = (username, password) => {
    return post(`auth/login`, {
        username: username,
        password: password,
    });
};

const _register = (username, restaurantName, password) => {
    return post(`restaurant/create`, {
        username: username,
        password: password,
        restaurantName: restaurantName,
    });
};

const logout = () => {
    const authTokenStore = useAuthTokenStore();
    const refreshTokenStore = useRefreshTokenStore();
    authTokenStore.$reset();
    refreshTokenStore.$reset();
}

const login = async (username, password) => {
    try {
        const response = await _login(username, password);
        const authTokenStore = useAuthTokenStore();
        const refreshTokenStore = useRefreshTokenStore();
        authTokenStore.token = response.data["accessToken"];
        refreshTokenStore.token = response.data["refreshToken"];
        return response;
    } catch (error) {
            throw new Error(error);
    }
};

const register = async (username, restaurantName, password) => {
    try {
        const response = await _register(username, restaurantName, password);
        console.log(response);
        if (response.status === 200) {
            return await login(username, password);
        } else {
            return {status: response.status, message: response.data["Erreur"]};
        }
    } catch (error) {
            throw new Error(error);
    }
};

export {login, register, logout};
