import axios from "axios";
import { axiosConfig } from "./config/axiosConfig";
import { baseUrl } from "./config/baseUrl";

const username = document.getElementById("username");
const company = document.getElementById("company");

window.onload = async () => {
    try {
        const getCurrentUser = await axios.get(`${baseUrl}/auth/me`, axiosConfig);
        const currentUser = getCurrentUser.data;
        console.log(currentUser);

        username.innerHTML = `Howdy, ${currentUser?.name}`
        company.innerHTML = currentUser?.company_name;
    } catch (error) {
        console.log(error)
    }
}