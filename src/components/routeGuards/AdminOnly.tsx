import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Outlet, Navigate } from 'react-router-dom';



const AdminOnly = () => {
    //VALUES
    const { user } = useContext(UserContext);



    //RENDER
    return user && user.user && user.user.role && user.user.role === 'admins'
    ?
    <Outlet />
    :
    <Navigate to="/" />
}

export default AdminOnly