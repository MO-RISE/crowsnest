
import {login} from './login'

const protocol = window.location.hostname === 'localhost' ? 'http://' : 'https://'

const authProvider = {
    login: login,
    logout: () => {
        const request = new Request(protocol + window.location.hostname + '/auth/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        return fetch(request).then(response => {
            return Promise.resolve('/admin/login')
        })
    },
    checkAuth: () => {
        const request = new Request(protocol + window.location.hostname + '/auth/api/me', {
            method: 'GET',
            credentials: 'include',
        })
        return fetch(request).then(response => {
            if (response.status !== 200) {
                throw new Error("You are not logged in.")
            }
           return response.json()
        }).then(data => {
            if (!data.admin) {
                throw new Error("You are not an administrator.")
            }
            return Promise.resolve()
        }).catch(err => Promise.reject({redirectTo:'/admin/login', message:err.message}))
            
    },
    checkError:  (error) => {
        console.log("Running CheckError")
        const status = error.status;
        if (status === 401 || status === 403) {
            return Promise.reject({redirectTo:'/admin/login',logoutUser: false});
        }
        // other error code (404, 500, etc): no need to redirect
        return Promise.resolve();
    },
    getIdentity: () => {
        const request = new Request(protocol + window.location.hostname + '/auth/api/me', {
            method: 'GET',
            credentials: 'include',
        })
        const data = fetch(request).then(response=>response.json()).then((data) => { 
            return {
            id: data.username,
            fullName: data.firstname + ' ' + data.lastname,
        }})
        return Promise.resolve(data)
    },
    getPermissions: () => Promise.resolve()
};

export default authProvider