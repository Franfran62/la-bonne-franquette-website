import axiosInstance from "@/middlewares/axiosConfig.js";


const fetchUsers = async () => {
    try {
        return await axiosInstance.get(`/equipe`);
    } catch (error) {
        if (error.response) {
            return {status: error.response.status, message: error.response.data["Erreur"]};
        } else {
            throw new Error(error);
        }
    }
}

export {fetchUsers};