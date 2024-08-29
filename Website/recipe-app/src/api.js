import axios from 'axios'

const api = axios.create({
    baseURL:  'https://recipe-storer-1.onrender.com' 
})

export default api;