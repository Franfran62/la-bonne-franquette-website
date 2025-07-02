import { fetch, put } from "./axiosService";

const getRestauratnName = async () => {
    try {
        const response = await fetch("restaurant/name");
        if (response.status === 200) {
            return response.data.name;
        }
    } catch (error) {
        throw new Error(error);
    }
};

const editRestaurantName = async (newName) => {
    try {
        return await put("restaurant/rename", {
            newRestaurantName: newName,
        });
    } catch (error) {
        throw new Error(error);
    }
};

export {getRestauratnName, editRestaurantName};