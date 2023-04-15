import axios from "axios";
import { axiosConfig } from "./config/axiosConfig";
import { baseUrl } from "./config/baseUrl";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const modal = document.getElementById("template-modal");
const modalForm = document.getElementById("template_form");
const showModal = document.getElementById("customise-template");
const closeModal = document.getElementById("modal-close");
const username = document.getElementById("username");
const company = document.getElementById("company");
const createTemplate = document.getElementById("add_template_btn");
const templateList = document.getElementById("template-list");
const frame = document.getElementById("frame");

showModal.addEventListener("click", () => {
    modal.style.display = "block";
})
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
})

window.onload = async () => {
    try {
        const getCurrentUser = await axios.get(`${baseUrl}/auth/me`, axiosConfig);
        const currentUser = getCurrentUser.data;

        const getQuestions = await axios.get(`${baseUrl}/templates`, axiosConfig);
        const response = getQuestions.data;
        const questions = response?.data.data;

        username.innerHTML = `Howdy, ${currentUser?.name}`
        company.innerHTML = currentUser?.company_name;

        let str = '';

        questions.forEach(({id, title, short_description, questions_count, company_name }) => {
            str += `
            <div class="rounded-3xl p-8 ring-1 xl:p-10 ring-gray-200">
                <h3 id="tier-freelancer" class="text-lg font-semibold leading-8 text-gray-900">${title}</h3>
                <p class="mt-4 text-sm leading-6 text-gray-600">
                    ${short_description}
                </p>
                <p class="mt-4 text-sm leading-6 font-bold text-gray-600">
                    Questions : 
                    <span class="font-light ml-2">
                        ${questions_count}
                    </span>
                </p>
                <ol role="list" id="list-${id}" class="mt-2 hidden space-y-3 text-sm leading-6 xl:mt-4 text-gray-500">
                    <li class="flex gap-x-3">
                        <span class="font-semibold">1.</span>
                        <div class="flex flex-col">
                            <span>
                                Do you enjoy our service?
                            </span>
                        </div>
                    </li>
                </ol>
                <a href="#" onclick="handlePick(${id})" id="${id}" aria-describedby="tier-freelancer" class="mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600">Select template</a>
                <a href="#" onclick="handleClick(${id})" id="${id}" aria-describedby="tier-freelancer" class="mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600">View Questions</a>
                <a href="#" onclick="handleDelete(${id})" id="${id}" class="mt-4 block border border-gray-400 rounded-md py-2 px-3 text-center text-red-400 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Delete template</a>
            </div>
            `
        })

        window.handlePick = async(id) => {

            const getTemplateQuestions = await axios.get(`${baseUrl}/templates/${id}`, axiosConfig);
            const responses = getTemplateQuestions.data;
            const datalist = responses.data.questions;
            console.log(datalist)

            const iframeData = `<div style="border-radius:5px; padding:20px;>
            <div>
              <div class="text-center">
                <h3 class="text-base font-semibold leading-6 text-gray-900">Questionnaires</h3>
              </div>
            </div>
            <form id="template_form" method="POST" class="space-y-3">
            ${datalist.map(({ question, options, type}, index) => {
                const parseArr = JSON.parse(options);
                return(
                    `
                        ${type === "Text" && `
                        <div style="margin-bottom:15px">
                            <label for="title">${question}</label>
                            <div style="margin-top : 8px">
                                <select name="" id="options" style="width:100%; padding : 5px; border : 1px solid gray; border-radius:5px">
                                ${parseArr?.map(({key, value}) => {
                                    return `<option value="${key}">${value}</option>`
                                })}
                                </select>
                            </div>
                        </div>
                        `
                        }
                        ${type === "checkbox" && `
                            <div style="margin-bottom : 15px">
                                <label for="description">${question}</label>
                                <div style="margin-top : 8px">
                                    <fieldset class="mt-4">
                                        <legend class="sr-only">Notification method</legend>
                                        <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                            ${parseArr?.map(({key, value}) => {
                                                return `
                                                <div class="flex items-center">
                                                    <input id="q2Yes" name="q2Yes" type="radio" checked class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
                                                    <label for="q2Yes" class="ml-3 block text-sm font-medium leading-6 text-gray-900">${value}</label>
                                                </div>
                                                `
                                            })}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        `
                        }
                        ${type === "radio" && `
                            <div style="margin-bottom : 15px">
                                <label for="description">${question}</label>
                                <div style="margin-top : 8px">
                                    <fieldset class="mt-4">
                                        <legend class="sr-only">Notification method</legend>
                                        <div class="">
                                            ${parseArr?.map(({key, value}) => {
                                                return `
                                                <div class="flex items-center">
                                                    <input id="q2Yes" name="q2Yes" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
                                                    <label for="q2Yes" class="ml-3 block text-sm font-medium leading-6 text-gray-900">${value}</label>
                                                </div>
                                                `
                                            })}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        `
                        }
                        ${type === "text" && `
                            <div style="margin-bottom : 15px">
                                <label for="description">${question}</label>
                                <div style="margin-top : 8px">
                                    <input id="q4" name="q4" type="text" autocomplete="q4" style="width : 100%; padding : 10px; border : 1px solid gray; border-radius : 5px" />
                                </div>
                            </div>
                        `
                        }
                    `
                )
            })}
                <div class="style="margin-top : 8px"">
                    <button id="add_template_btn" type="submit" style="width : 100%; padding:10px; border-radius:5px; border:none; background : gray; color : white">
                    Submit Answers
                    </button>
                </div>
            </form>
        </div>
        `
        frame.innerHTML = iframeData;
        }

        window.handleClick = async (id) => {
            const question = document.getElementById(`list-${id}`)
            try {
                const getTemplateQuestions = await axios.get(`${baseUrl}/templates/${id}`, axiosConfig);
                const responses = getTemplateQuestions.data;
                const datalist = responses.data.questions;

                let strTxt = '';
                datalist.map(({id, question, options}, index) => {
                    const parseArr = JSON.parse(options);
                    strTxt += `
                        <li class="flex gap-x-3">
                            <p class="font-semibold">${index + 1}</p>
                            <div class="flex flex-col">
                                <p>
                                    ${question}
                                </p>
                                <div class="flex flex-col">
                                    ${parseArr?.map(({key, value}) => {
                                        return `<span>${key} : ${value}</span>`
                                    })}
                                </div>
                            </div>
                        </li>
                    `
                })
                question.style.display = "block";
                question.innerHTML = strTxt;
                
            } catch (error) {
                console.log(error)
            }
        }
        window.handleDelete = async (id) => {
            try {
                const deletingTemp = await axios.delete(`${baseUrl}/templates/${id}`, axiosConfig);
                const response = deletingTemp.data;
                if(response.code == 200){
                    Toastify({
                        text: response.message,
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                        style: {
                          background: "green",
                        },
                    }).showToast();
                    setTimeout(() => {
                        location.reload();
                    },1500)
                }
            } catch (error) {
                console.log(error)
            }
        }
        templateList.innerHTML = str;

    }catch(err){
        console.log(err);
    }
}

createTemplate.addEventListener("click", async(e) => {
    e.preventDefault();
    const title = modalForm.title.value;
    const description = modalForm.description.value;
    const q1 = modalForm.q1.value;
    const q1option1 = modalForm.q1optionone.value;
    const q1option2 = modalForm.q1optiontwo.value;
    const q1option3 = modalForm.q1optionthree.value;
    const q2 = modalForm.q2.value;
    const q3 = modalForm.q3.value;
    const q4 = modalForm.q4.value;

    const formData = {
        "title": title,
        "short_description": description,
        "questions": [
            {
                "question": q1,
                "options": [
                    {
                        "key": "A",
                        "value": q1option1
                    },
                    {
                        "key": "B",
                        "value": q1option2
                    },
                    {
                        "key": "C",
                        "value": q1option3
                    },
                    {
                        "key": "D",
                        "value": ""
                    }
                ]
            },
            {
                "question": q2,
                "type": "checkbox",
                "options": [
                    {
                        "key": "yes",
                        "value": "Yes"
                    },
                    {
                        "key": "no",
                        "value": "No"
                    }
                ]
            },
            {
                "question": q3,
                "type": "radio",
                "options": [
                    {
                        "key": "1",
                        "value": true
                    },
                    {
                        "key": 0,
                        "value": false
                    }
                ]
            },
            {
                "question": q4,
                "type": "text"
            }
        ]
    }

    try {
        const creatingTemplate = await axios.post(`${baseUrl}/templates`, formData, axiosConfig);
        const response = creatingTemplate.data;
        if(response.code == 200){
            Toastify({
                text: "Template created successfully!!",
                duration: 3000,
                gravity: "top",
                position: "right",
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "green",
                },
            }).showToast();
            setTimeout(() => {
                modal.style.display = "none";
                location.reload();
            },1500)
        }
        console.log(response)
    } catch (error) {
        console.log(error.response.data)
    
    }
})

