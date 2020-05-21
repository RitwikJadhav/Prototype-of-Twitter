import axios from 'axios';
import alertService from '../services/alertService';

if (localStorage.getItem("token")) {
    let token = localStorage.getItem("token");
    setJwt(token);
}

axios.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500
    if (!expectedError) {
        console.log("Logging out error", error);
    }
    if (error.response)
        alertService.error(error.response.data)
    return Promise.reject(error)
})

function setJwt(jwt) {
    axios.defaults.headers.common["authorization"] = jwt;
}

export default {
    get: axios.get,
    post: axios.post,
    setJwt
}