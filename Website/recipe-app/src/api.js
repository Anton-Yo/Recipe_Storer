import axios from 'axios'




const api = axios.create({
    //baseURL: "http://127.0.0.1:8000/"
    baseURL: process.env.VERCEL_URL == null ? 'http://127.0.0.1:8000/' : `https://${process.env.VERCEL_URL}`
   
    //baseURL: "https://recipe-storer-9mktzz8ml-anton-yos-projects.vercel.app/"
})

const getString = () =>
{
    if(process.env.VERCEL_URL == null)
    {
        return 'http://127.0.0.1:8000/'
    }
    else
    {
        return `https://${process.env.VERCEL_URL}`
    }
}

export default api;