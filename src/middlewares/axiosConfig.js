import {useAuthTokenStore, useRefreshTokenStore} from "@/stores/authToken";
import axios from "axios";
import router from "@/router";


const axiosInstance = axios.create({
    baseURL: `/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error);
        if (error.code === "ERR_NETWORK" || error.status === 599 || error.response.status === 599) {
            error = "Impossible de contacter le serveur, réessayez plus tard."
        } else if (error.code === "ERR_CONNECTION_REFUSED" || error.status === 401 || (error.response && error.response.status === 401)) {
            useAuthTokenStore.token = "";
            router.push({name: "connexion"}).then();
        } else if (error.status >= 500 || error.response.status >= 500) {
            error = "Oups, une erreur est survenue, réessayez plus tard."
        } else {
            error = error.response?.data?.Erreur || error.message;
        }
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.request.use(
    (config) => {
        const authTokenStore = useAuthTokenStore();
        const refreshTokenStore = useRefreshTokenStore();
        const authToken = authTokenStore.token;
        const refreshToken = refreshTokenStore.token;

        if (authToken) {
            config.headers["Auth-Token"] = authToken;
        }

        if (refreshToken) {
            config.headers["Refresh-Token"] = refreshToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
