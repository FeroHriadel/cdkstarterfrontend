import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';



const HomePage: React.FC = () => {
  return (
    <div className='container text-center'>
        <h1>Home Page</h1>

        <br /><br /><br />

        <main className='row'>
          <div className='col-md-6 offset-md-3'>
            <Link to='/tags'> <Button variant='primary' className='col-10 m-2'>Tags</Button> </Link>
            <Link to='/categories'> <Button variant='primary' className='col-10 m-2'>Categories</Button> </Link>
            <Link to='/items'> <Button variant='primary' className='col-10 m-2'>Items</Button> </Link>
          </div>
        </main>
    </div>
  )
}

export default HomePage