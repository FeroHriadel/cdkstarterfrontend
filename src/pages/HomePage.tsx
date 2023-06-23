import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';



const HomePage: React.FC = () => {
  //VALUES
  const { user } = useContext(UserContext);



  //RENDER
  return (
    <div className='container text-center'>
        <h1>Home Page</h1>

        <br /><br /><br />

        <main className='row'>
          <div className='col-md-6 offset-md-3'>
            <Link to='/tags'> <Button variant='primary' className='col-10 m-2'>Tags</Button> </Link>
            <Link to='/categories'> <Button variant='primary' className='col-10 m-2'>Categories</Button> </Link>
            <Link to='/items'> <Button variant='primary' className='col-10 m-2'>Items</Button> </Link>
            { user?.user?.role === 'admins' && <Link to='/admin/batchoperations'> <Button variant='primary' className='col-10 m-2'>Batch Operations</Button> </Link> }
          </div>
        </main>
    </div>
  )
}

export default HomePage