import {useAuthTokenStore, useRefreshTokenStore} from "@/stores/authToken";
import axios from "axios";
import router from "@/router";


const apiURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: `${apiURL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error);
        if (error.status === 401 || error.code === 'ERR_BAD_REQUEST') {
            useAuthTokenStore.token = "";
            router.push({name: "connexion"}).then();
        } else if (error.status === 599 || error.code === "ERR_NETWORK") {
            console.log(error);
            error = "Impossible de contacter le serveur, réessayez plus tard."
        } else if (error.status >= 500) {
            console.log(error);
            error = "Oups, une erreur est survenue, réessayez plus tard."
        } else {
            console.log(error);
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

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
