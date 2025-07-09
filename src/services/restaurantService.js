import { fetch, put } from "./axiosService";

const getRestauratnName = async () => {
    try {
        const response = await fetch("restaurant/name");
        if (response.status === 200) {
            return response.data.name;
        }
    } catch (error) {
        throw error;
    }
};

const editRestaurantName = async (newName) => {
    try {
        return await put("restaurant/rename", {
            newRestaurantName: newName,
        });
    } catch (error) {
        throw error;
    }
};

export {getRestauratnName, editRestaurantName};