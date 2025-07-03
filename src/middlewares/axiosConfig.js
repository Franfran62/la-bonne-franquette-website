import { useAuthTokenStore, useRefreshTokenStore } from "@/stores/authToken";
import axios from "axios";
import router from "@/router";
import { post } from "@/services/axiosService";

const apiURL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : "https://labonnefranquette.fun/api/v1";

const axiosInstance = axios.create({
    baseURL: apiURL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("auth/refresh")
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = useRefreshTokenStore().token;
                const response = await post("auth/refresh", {
                    refreshToken: refreshToken,
                });
                useAuthTokenStore().token = response.data.accessToken;
                originalRequest.headers["Auth-Token"] = response.data.accessToken;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                useAuthTokenStore().token = "";
                useRefreshTokenStore().token = "";
                router.push({ name: "connexion" });
                return Promise.reject(refreshError);
            }
        } else if (
            error.code === "ERR_NETWORK" ||
            error.status === 599 ||
            error.response.status === 599
        ) {
            error = "Impossible de contacter le serveur, réessayez plus tard.";
        } else if (error.status >= 500 || error.response.status >= 500) {
            error = "Oups, une erreur est survenue, réessayez plus tard.";
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

        if (authToken && !config.url.includes("auth/refresh")) {
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
