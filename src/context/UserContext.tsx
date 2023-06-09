import React, { useState, useEffect } from 'react';
import { getUserAndToken, removeCookie, setCookie, removeUserAndToken } from '../helpers/cookie';
import { logout as amplifyLogout, refreshIdToken } from '../actions/amplifyActions'



export type UserDetails = {
    username: string;
    email: string;
    role?: string;
}

export type UserState = {
    user: UserDetails | null;
    token: string | undefined;
}

export type UserContextObj = {
    user: UserState | null;
    login: (userDetails: UserState) => void;
    logout: () => void;
}





export const UserContext = React.createContext<UserContextObj>({
    user: null,
    login: () => {},
    logout: () => {}
})



const UserContextProvider: React.FC<{ children: React.ReactNode }> = (props: React.PropsWithChildren) => {
    const [user, setUser] = useState<UserState | null>(null);
    let refreshTokenInterval: any;

    const loginHandler = (userDetails: UserState) => { //say what login will do
        setUser(userDetails);
      }
    
      const logoutHandler = async () => { //say what logout will do
        setUser(null);
        removeUserAndToken();
        await amplifyLogout();
      }

      const contextValue: UserContextObj = { //say what values context will have
        user,
        login: loginHandler,
        logout: logoutHandler
      }
      
      //populate user from previous session (if any) & update token:
      useEffect(() => { //load user if stored in LS and token in cookies
        const userWithToken = getUserAndToken();
        if (userWithToken) setUser(userWithToken);
      }, []);

      const refreshToken = async () => { //tell amplify to refresh idToken
        if (user && user.user) {
          const result = await refreshIdToken();
          if (result.error || !result.token) {
            setUser(null); 
            removeUserAndToken(); 
            await amplifyLogout(); 
            clearInterval(refreshTokenInterval); 
            alert('Your session has expired. Please sign in again.')
          }
          else {
            setCookie('token', result.token!); 
            console.log('token refreshed')
          }
        }
      }

      useEffect(() => { //keep refreshing token every 5 minutes
        if (user?.user?.email) {
          clearInterval(refreshTokenInterval);
          refreshToken();
          refreshTokenInterval = setInterval(() => { refreshToken() }, 1000 * 60 * 5);
        }
      }, [user]);

      const reActivateRefreshTokenInterval = () => { //refreshTokenInterval stops running when window is out of focus. This should reActivate the interval when window becomes focused again
        if (user?.user?.username) {
          clearInterval(refreshTokenInterval);
          refreshToken();
          refreshTokenInterval = setInterval(() => { refreshToken() }, 1000 * 60 * 5);
        } else {

        }
      }

      useEffect(() => {
        window.addEventListener('focus', reActivateRefreshTokenInterval);
        return () => window.removeEventListener('focus', reActivateRefreshTokenInterval);
      }, []);

      return (
        <UserContext.Provider value={contextValue}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;



