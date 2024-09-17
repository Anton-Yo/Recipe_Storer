import axios from 'axios'

const api = axios.create({
    //Website
    //baseURL:  'https://recipe-storer-1.onrender.com' 

    //PC
    baseURL: 'http://127.0.0.1:8000/'

    //Mobile - Doesnt work
    //baseURL: '192.168.0.172:3000/'
})

export default api;