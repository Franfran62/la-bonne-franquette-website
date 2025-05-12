import { useAuthTokenStore, useRefreshTokenStore } from "@/stores/authToken";
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
        if (error.response && error.response.status === 403) {
            console.log(error.response);
            router.push({ name: "connexion" }).then();
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
