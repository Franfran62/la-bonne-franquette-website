import axiosInstance from "@/middlewares/axiosConfig.js";

const fetch = async (endpoint) => {
    try {
        return axiosInstance.get(`/${endpoint}`);
    } catch (e) {
        throw new Error(e);
    }
}

const post = async (endpoint, payload) => {
    try {
        return axiosInstance.post(`/${endpoint}`, payload);
    } catch (e) {
        throw new Error(e);
    }
}

const put = async (endpoint, payload) => {
    try {
        return axiosInstance.put(`/${endpoint}`, payload);
    } catch (e) {
        throw new Error(e);
    }
}

const remove = async (endpoint, id) => {
    try {
        return await axiosInstance.delete(`${endpoint}/${id}`);
    } catch (e) {
        throw new Error(e);
    }
}

export {fetch, post, put, remove};