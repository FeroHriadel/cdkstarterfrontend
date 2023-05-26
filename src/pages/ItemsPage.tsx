import React from 'react';
import { useNavigate } from 'react-router-dom';



const ItemsPage = () => {
    //VALUES
    const navigate = useNavigate();



    //RENDER
    return (
        <div className='container text-center'>
            <h1>Home Page</h1>

            <br /><br /><br />

            <button onClick={() => navigate('/items/itemform')}>form</button>
        </div>
    )
}

export default ItemsPage