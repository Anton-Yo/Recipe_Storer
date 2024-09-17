import axios from 'axios'

const api = axios.create({
    //baseURL:  'https://recipe-storer-1.onrender.com' 

    baseURL: 'http://127.0.0.1:8000/'
})

export default api;