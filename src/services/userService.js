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

const createUser = async (username, password, role) => {
    try {
        return await axiosInstance.post(`/equipe`,{
            username: username,
            password: password,
            role: role,
        })
    } catch (error) {
        if (error.response) {
            return {status: error.response.status, message: error.response.data["Erreur"]};
        } else {
            throw new Error(error);
        }
    }
}

const updateUser = async (username, password, role, oldUsername, oldPassword) => {
    try {
        console.log(oldUsername)
        const data = {
            username,
            password,
            role,
            oldUsername,
            oldPassword
        };

        JSON.stringify(data);

        return await axiosInstance.put(`/equipe`,data);
    } catch (error) {
        if (error.response) {
            return {status: error.response.status, message: error.response.data["Erreur"]};
        } else {
            throw new Error(error);
        }
    }
}

export {fetchUsers, createUser, updateUser};