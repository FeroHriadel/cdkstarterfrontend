import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import cdkImage from '../images/cdk.jpg';
import { Link, useNavigate } from 'react-router-dom';



const MainNav: React.FC = () => {
  //VALUES
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);


  
  //RENDER
  return (
    <nav className='main-nav'>
        <div className='container'>
        <div className='left-side'>
            <img src={cdkImage} alt="logo" className='logo' onClick={() => navigate('/')} title="Home" />

            <Link to='/tags'>
                <p className='link'>Tags</p>
            </Link>

            <Link to='/categories'>
                <p className='link'>Categories</p>
            </Link>
            <Link to='/items'>
                <p className='link'>Items</p>
            </Link>
        </div>

        <div className='right-side'>
          {
            user && user.user && user.user.username
            ?
            <p className='link pointer' onClick={() => logout()}>Sign out</p>
            :
            <React.Fragment>
              <Link to='/signup'>
                <p className='link pointer'>Sign up</p>
              </Link>

              <Link to='/signin'>
                <p className='link pointer'>Sign in</p>
              </Link>
            </React.Fragment>
          }
        </div>
        </div>
    </nav>
  )
}

export default MainNav