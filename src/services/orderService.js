import axiosInstance from "@/middlewares/axiosConfig.js";

const fetchOrders = async () => {
    try {
        return await axiosInstance.get(`/order`);
    } catch (error) {
            throw new Error(error);

    }
}

export {fetchOrders};