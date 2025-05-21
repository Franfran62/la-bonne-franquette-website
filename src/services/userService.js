import axiosInstance from "@/middlewares/axiosConfig.js";


const fetchUsers = async () => {
    try {
        return await axiosInstance.get(`/user`);
    } catch (error) {
            throw new Error(error);

    }
}

const createUser = async (username, password, role) => {
    try {
        return await axiosInstance.post(`/user`,{
            username: username,
            password: password,
            role: role,
        })
    } catch (error) {
            throw new Error(error);

    }
}

const updateUser = async (username, password, role, oldUsername, oldPassword) => {
    try {
        const data = {
            username,
            password,
            role,
            oldUsername,
            oldPassword
        };

        JSON.stringify(data);

        return await axiosInstance.put(`/user`,data);
    } catch (error) {
            throw new Error(error);

    }
}

const deleteUser = async (username) => {
    try {
        return await axiosInstance.delete(`user/${username}`);
    } catch (error) {
            throw new Error(error);

    }
}

export {fetchUsers, createUser, updateUser, deleteUser};