import React, { useState, useEffect } from 'react';
import { getUserAndToken, removeCookie, setCookie } from '../helpers/cookie';
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
        removeCookie('token');
        await amplifyLogout();
      }

      const contextValue: UserContextObj = { //sat what values context will have
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
        const result = await refreshIdToken();
        if (result.error) { setUser(null); removeCookie('token'); alert('Your session has expired. Please sign in again.') }
        else { setCookie('token', result.token!); console.log('token refreshed') }
      }

      useEffect(() => { //keep refreshing token every 5 minutes
        if (user) {
          clearInterval(refreshTokenInterval);
          refreshToken();
          refreshTokenInterval = setInterval(() => { refreshToken() }, 1000 * 60 * 5);
        }
      }, [user]);

      return (
        <UserContext.Provider value={contextValue}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;



