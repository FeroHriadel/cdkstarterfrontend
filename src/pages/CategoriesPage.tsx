import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../actions/categoryActions';
import { RootState, AppDispatch } from '../store';
import { ListGroup, Button } from 'react-bootstrap';
import { FaTrash, FaPenFancy } from "react-icons/fa";
import ConfirmModal from '../components/modals/ConfirmModal';



const CategoriesPage: React.FC = () => {
  //VALUES
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch(); //dispatch like e.g.: dispatch(changeMessage('No tags found'));
  const message = useSelector((state: RootState) => state.message);
  const categories = useSelector((state: RootState) => state.categories);
  const [modalShown, setModalShown] = useState(false);
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { user } = useContext(UserContext);
  const token = user?.token;



  //METHODS
  useEffect(() => {
    dispatch(fetchCategories());
}, [dispatch]);



  //RENDER
  return (
    <div className='container text-center'>
        <h1>Categories Page</h1>

        <br /><br /><br />

        <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
            <p className='text-center message'>{message}</p>
        </div>

        <ListGroup>
                <ListGroup.Item className='text-center text-light bg-primary' style={{position: 'relative'}}> 
                    <h5 className='text-center'>CATEGORIES</h5>
                    {
                        user?.user?.role === 'admins'
                        &&
                        <Button 
                            style={{position: 'absolute', top: '50%', right: '1px', transform: 'translateY(-50%)'}}
                            onClick={() => navigate('/admin/categoryform')}
                        >
                            <b>+</b>
                        </Button>
                    }
                </ListGroup.Item>
                {
                    categories
                    &&
                    categories.map(category => (<ListGroup.Item key={category.categoryId} className='pointer'>
                        <div className='w-100 d-flex align-items-center justify-content-between'>
                            <div className='d-flex align-items-center'>
                                { 
                                    category.image
                                    ?
                                    <div className='category-thumbnail' style={{backgroundImage: `url(${category.image})`}} />
                                    :
                                    <div className='category-thumbnail' />
                                }
                                <p>{category.name}</p>
                            </div>
                            {
                                user?.user?.role === 'admins'
                                &&
                                <div className='d-flex'>
                                    <p title='delete' className='m-1' onClick={() => {setModalShown(true); setCategoryToDelete(category.categoryId!)}}> <FaTrash /> </p>
                                    <p title='edit' className='m-1' onClick={() => navigate(`/admin/categoryform?action=update&categoryId=${category.categoryId}`)}> <FaPenFancy /> </p>
                                </div> 
                            }
                        </div>
                    </ListGroup.Item>))
                }
            </ListGroup>

    </div>
  )
}

export default CategoriesPage