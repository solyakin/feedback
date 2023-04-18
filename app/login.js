import axios from "axios";
import { baseUrl } from "./config/baseUrl";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
const loginBtn = document.getElementById("login_btn");
const loginForm = document.getElementById("login_form")

loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const emailValue = loginForm.email.value;
    const passwordValue = loginForm.password.value;
    const data = {
        email : emailValue,
        password : passwordValue
    }

    try {
        const login = await axios.post(`${baseUrl}/auth/login`, data);
        const response = login.data;
        if(response.access_token){
            localStorage.setItem("token", response.access_token);
            location.href = '/dashboard.html';
        }
    } catch (error) {
        const responseMsg= error.response.data;
        if(responseMsg){
            Toastify({
                text: "Invalid credentials",
                duration: 3000,
                gravity: "top",
                position: "right",
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "red",
                },
            }).showToast();
        }
    }
})