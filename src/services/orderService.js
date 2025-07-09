import {fetch} from "@/services/axiosService.js";

const fetchOrders = async () => {
    try {
        return await fetch("order");
    } catch (error) {
            throw error;
    }
}

export {fetchOrders};