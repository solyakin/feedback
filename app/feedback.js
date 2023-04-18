import axios from 'axios';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { axiosConfig } from './config/axiosConfig';
import { baseUrl } from './config/baseUrl';

const downloadbtn = document.getElementById("download-btn")
const username = document.getElementById("username");
const company = document.getElementById("company");

window.onload = async () => {

    try {
        const getCurrentUser = await axios.get(`${baseUrl}/auth/me`, axiosConfig);
        const currentUser = getCurrentUser.data;

        username.innerHTML = `Howdy, ${currentUser?.name}`
        company.innerHTML = currentUser?.company_name;

    }catch(error){
        console.log(error)
    }
}

downloadbtn.addEventListener("click", () => {
    const doc = new jsPDF()
    doc.autoTable({ html: '#feedback-table' })
    doc.save('table.pdf')
})

