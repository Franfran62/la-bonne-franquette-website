import axiosInstance from "@/middlewares/axiosConfig.js";

const fetchOrders = async () => {
    try {
        return await axiosInstance.get(`/commandes`);
    } catch (error) {
        if (error.response) {
            return {status: error.response.status, message: error.response.data["Erreur"]};
        } else {
            throw new Error(error);
        }
    }
}

export {fetchOrders};