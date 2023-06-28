import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../actions/categoryActions';
import { batchDeleteItems } from '../actions/itemActions';
import { RootState, AppDispatch } from '../store';
import { ListGroup, Button } from 'react-bootstrap';
import { FaTrash, FaPenFancy } from "react-icons/fa";
import ConfirmModal from '../components/modals/ConfirmModal';



const BatchOperationsPage = () => {
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
  //get categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  //modal
  useEffect(() => {
    if (modalShown === false) setCategoryToDelete(null);
  }, [modalShown]);

  useEffect(() => {
    if (actionConfirmed && categoryToDelete) {
        dispatch(batchDeleteItems(categoryToDelete, token!));
        setActionConfirmed(false);
    }
  }, [actionConfirmed, token, categoryToDelete, dispatch]);



  //RENDER
  return (
    <div className='container text-center'>
        <h1>Batch Operations Page</h1>

        <br /><br /><br />

        <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
            <p className='text-center message'>{message}</p>
        </div>

        <ListGroup>
            <ListGroup.Item className='text-center text-light bg-primary' style={{position: 'relative'}}> 
                <h5 className='text-center'>DELETE ALL ITEMS IN A CATEGORY:</h5>
            </ListGroup.Item>
            {
                categories
                &&
                categories.map(category => (<ListGroup.Item key={category.categoryId}>
                    <div className='w-100 d-flex align-items-center justify-content-between'>
                        <div className='d-flex align-items-center pointer' onClick={() => navigate(`/categories/${category.categoryId}`)}>
                            <p>{category.name}</p>
                        </div>
                        {
                            user?.user?.role === 'admins'
                            &&
                            <div className='d-flex'>
                                <p title='delete' className='m-1 pointer' onClick={() => {
                                    if (message) return;
                                    setModalShown(true); 
                                    setCategoryToDelete(category.categoryId!)}}
                                >
                                    <FaTrash />
                                </p>
                            </div> 
                        }
                    </div>
                </ListGroup.Item>))
            }
        </ListGroup>

        <ConfirmModal show={modalShown} onHide={() => setModalShown(false)} setActionConfirmed={setActionConfirmed} />
        
    </div>
  )
}

export default BatchOperationsPage