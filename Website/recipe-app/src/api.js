import axios from 'axios'

const api = axios.create({
    //baseURL: "http://127.0.0.1:8000/"
    baseURL: process.env.REACT_APP_VERCEL_URL == null ? 'https://recipe-storer-git-main-anton-yos-projects.vercel.app/' : `https://${process.env.REACT_APP_VERCEL_URL}`
})

export default api;