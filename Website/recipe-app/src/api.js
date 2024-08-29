import axios from 'axios'

const api = axios.create({
    baseURL:  'https://recipe-storer-1.onrender.com' 
   
    //baseURL: "https://recipe-storer-9mktzz8ml-anton-yos-projects.vercel.app/"
})

export default api;