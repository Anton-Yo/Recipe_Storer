import axios from 'axios'

const api = axios.create({
    //baseURL: "http://127.0.0.1:8000/"
    baseURL: `https://${process.env.VERCEL_URL}` || window.location.origin
    //baseURL: "https://recipe-storer-9mktzz8ml-anton-yos-projects.vercel.app/"
})

export default api;