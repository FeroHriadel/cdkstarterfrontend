import React, { useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';



const VisitorsOnly = () => {
    const { user } = useContext(UserContext);
    const isLoggedIn = user !== null;
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) navigate('/');
    }, []) //not putting user into dependencies, because I wanna show message in LoginPage after user logs in ==> user would never see the message


    return (
        <div></div>
    )
}

export default VisitorsOnly