import axios from "axios";
import { baseUrl } from "./config/baseUrl";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
const registerBtn = document.getElementById("register_btn");
const registerForm = document.getElementById("register_form")

registerBtn.addEventListener("click", async(e) => {
    e.preventDefault();
    const name = registerForm.name.value;
    const emailValue = registerForm.email.value;
    const passwordValue = registerForm.password.value;
    const companyName = registerForm.company_name.value;
    
    const formData = {
        name : name,
        email : emailValue,
        company_name : companyName,
        password : passwordValue,
        password_confirmation : passwordValue,
    }
    if(name !== "" && emailValue !== "" && passwordValue !== "" && companyName !== ""){
        try {
            const registering = await axios.post(`${baseUrl}/auth/register`, formData);
            const response = registering.data;
            if(response.code === 200){
                setTimeout(() => {
                    location.href = '/login.html';
                },2000)
            }
        } catch (error) {
            const responseMsg= error.response.data.errors;
            if(responseMsg.email){
                const emailError = responseMsg.email[0];
                Toastify({
                    text: emailError,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "red",
                    },
                  }).showToast();
            }
            if(responseMsg.password){
                const passwordError = responseMsg.password[0];
                Toastify({
                    text: passwordError,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "red",
                    },
                  }).showToast();
            }
            if(responseMsg.company_name){
                const companyError = responseMsg.company_name[0];
                Toastify({
                    text: companyError,
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
    }
})