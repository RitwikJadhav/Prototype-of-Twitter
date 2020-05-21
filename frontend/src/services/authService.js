import jwtDecode from 'jwt-decode';
import apiService from './httpService';
import { backendURI } from '../utils/config';



export async function login(email_id, password) {
    const credentials = {
        email_id: email_id,
        password: password
    }
    try {
        const { data: token } = await apiService.post(`${backendURI}/api/login`, credentials);
        apiService.setJwt(token);
        localStorage.setItem("token", token);

        try {
            const authToken = localStorage.getItem("token");
            const jwt = authToken.split(" ")[1]
            let user = jwtDecode(jwt);
            if (!user) {
                return false;
            }
            else {
                localStorage.setItem("email_id", user.email_id);
                localStorage.setItem("user_id", user.user_id);
                localStorage.setItem("first_name", user.first_name);
                localStorage.setItem("last_name", user.last_name);
                localStorage.setItem("user_name", user.user_name);
                if (user.user_image)
                    localStorage.setItem("user_image", user.user_image);
                return true;
            }
        }
        catch (ex) {
            return null;
        }
    } catch (err) {
        if (err.response)
            console.log(err.response.data);
    }
}

export function logout() {
    localStorage.clear();
}

export function getJwt() {
    return localStorage.getItem("token");
}

export default {
    login, logout
};