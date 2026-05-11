//Ορίζω το base URL του backend API. Σημείο επικοινωνίας


import axios from 'axios';

const api = axios.create({
    baseURL: 'http://LAPTOP-GO2ID0T5:3000/api'
});

export default api;