import axios from 'axios'

const getBaseURL = () => {
    if (window.location.hostname === 'localhost')
    {
        return 'http://127.0.0.1:8000/'
    }
    else
    {
        return 'https://recipe-storer-1.onrender.com'
    }
}

const api = axios.create({
    //Website
    //baseURL:  'https://recipe-storer-1.onrender.com' 

    //PC
    baseURL: getBaseURL()

    //Mobile - Doesnt work
    //baseURL: '192.168.0.172:3000/'
})



export default api;