import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Outlet, Navigate } from 'react-router-dom';



const LoggedInOnly = () => {
    //VALUES
    const { user } = useContext(UserContext);



    //RENDER
    return user && user.user && user.user.email
    ?
    <Outlet />
    :
    <Navigate to="/" />
}

export default LoggedInOnly