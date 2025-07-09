import {fetch, post, put, remove} from "@/services/axiosService.js";


const fetchUsers = async () => {
    try {
        return fetch("user");
    } catch (error) {
        throw error;
    }
}

const createUser = async (username, password, role) => {
    try {
        return await post("user",{
            username: username,
            password: password,
            role: role,
        })
    } catch (error) {
            throw error;
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

        return await put("user",data);
    } catch (error) {
            throw error;

    }
}

const deleteUser = async (username) => {
    try {
        return await remove("user", username);
    } catch (error) {
            throw error;

    }
}

export {fetchUsers, createUser, updateUser, deleteUser};