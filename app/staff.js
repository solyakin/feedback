import axios from "axios"
import { baseUrl } from "./config/baseUrl"
import { axiosConfig } from './config/axiosConfig';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const username = document.getElementById("username");
const company = document.getElementById("company");
const wrapper = document.getElementById("table-item");
const closeModal = document.getElementById("modal-close")
const addBtn = document.getElementById("add-btn")
const staffModal = document.getElementById("staff-modal")
const addStaffForm = document.getElementById("add_staff_form")
const addStaffBtn = document.getElementById("add_staff_btn")

window.onload = async () => {

    try {
        const getCurrentUser = await axios.get(`${baseUrl}/auth/me`, axiosConfig);
        const currentUser = getCurrentUser.data;
        const getUserslist = await axios.get(`${baseUrl}/get-customers`, axiosConfig);
        const response = getUserslist.data.data.data;
        console.log(currentUser);

        username.innerHTML = `Howdy, ${currentUser?.name}`
        company.innerHTML = currentUser?.company_name;

        let str = '';

        response.forEach(({id, name, email, role, company_name }) => {
            str += `
            <tr class="bg-white">
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    <a href="#" class="group font-medium flex flex-col gap-2 text-sm">
                       ${name}
                    </a>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
                    <span class="font-medium text-gray-900">${email}</span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
                    <time datetime="2020-07-11">${company_name}</time>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
                    <time datetime="2020-07-11">${role}</time>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
                    <span onclick="handleDelete('${id}')" class="text-red-300 hover:underline hover:text-red-400 cursor-pointer">remove</span>
                </td>
            </tr>
        `
        })
        wrapper.innerHTML = str;

    } catch (error) {
        console.log(error)
    }

    window.handleDelete = async(id) => {
        try {
            const deletingStaff = await axios.delete(`${baseUrl}/delete-customers/${id}`, axiosConfig);
            const response = deletingStaff.data;
            console.log(response)
            if(response.code == 200){
                Toastify({
                    text: "Staff deleted successfully!",
                    duration: 2000,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "green",
                    },
                }).showToast();
                setTimeout(() => {
                    location.reload();
                }, 2000)
            }
        } catch (error) {
            const error_response = error.response.data;
            if(error_response){
                Toastify({
                    text: "Deleting failed!",
                    duration: 2000,
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
}

addStaffBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const name = addStaffForm.name.value;
    const email = addStaffForm.email.value;
    const data = {
        name : name,
        email : email
    }
    if(name !== "" && email !== ""){
        try {
            const creatingStaff = await axios.post(`${baseUrl}/add-customers`, data, axiosConfig);
            const response = creatingStaff.data;
            console.log(response)
            if(response.code == 200){
                Toastify({
                    text: "Staff added successfully!",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "green",
                    },
                }).showToast();
                setTimeout(() => {
                    location.reload();
                }, 2000)
            }
        } catch (error) {
            const error_response = error.response.data;
            if(error_response){
                Toastify({
                    text: "Email already existed!",
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


addBtn.addEventListener("click", () => {
    staffModal.style.display = "block"
})
closeModal.addEventListener("click", () => {
    staffModal.style.display = "none"
})