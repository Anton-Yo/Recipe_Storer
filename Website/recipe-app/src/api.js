import axios from 'axios'

const api = axios.create({
    //baseURL: "http://127.0.0.1:8000/"
    //baseURL: window.location.origin
    baseURL: process.env.REACT_APP_VERCEL_URL == null ? 'http://127.0.0.1:8000/' : `https://${process.env.REACT_APP_VERCEL_URL}`
   
    //baseURL: "https://recipe-storer-9mktzz8ml-anton-yos-projects.vercel.app/"
})

export default api;