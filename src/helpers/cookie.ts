import cookie from 'js-cookie'; //also run: $ npm i --save-dev @types/js-cookie to get types
import { UserDetails } from '../context/UserContext';



//set cookie
export const setCookie = (key: string, value: string) => { 
    cookie.set(key, value);
}

//get cookie
export const getCookie: (key: string) => string | undefined = (key) => {
    return cookie.get(key);
}

//remove cookie
export const removeCookie = (key: string) => {
    cookie.remove(key);
}

//save user in LS & token in cookie
export const saveUserAndToken = (user: UserDetails, token: string) => {
    setCookie('token', token);
    localStorage.setItem('user', JSON.stringify(user));
} 

//remove user from LS & token from cookies
export const removeUserAndToken = () => {
    removeCookie('token');
    localStorage.removeItem('user');
}

//get user from LS & token from cookies
export const getUserAndToken = () => {
    const isCookie = getCookie('token');
    if (isCookie && localStorage.getItem('user')) return { user: {...JSON.parse(localStorage.getItem('user')!)}, token: getCookie('token') };
    else return undefined;
}



