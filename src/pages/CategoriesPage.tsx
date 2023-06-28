import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, deleteCategory } from '../actions/categoryActions';
import { RootState, AppDispatch } from '../store';
import { ListGroup, Button } from 'react-bootstrap';
import { FaTrash, FaPenFancy } from "react-icons/fa";
import ConfirmModal from '../components/modals/ConfirmModal';
import { getS3Object } from '../helpers/getS3Object';



const CategoriesPage: React.FC = () => {
  //VALUES
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch(); //dispatch like e.g.: dispatch(changeMessage('No tags found'));
  const message = useSelector((state: RootState) => state.message);
  const categories = useSelector((state: RootState) => state.categories);
  const [categoriesImages, setCategoriesImages] = useState<{[key: string]: string} | null>(null);
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

  //populate categories with images
  const getCategoryImage = async (categoryId: string, image: string) => {
    return new Promise((resolve, reject) => {
        getS3Object(image).then(data => {
            if (!data.error) return resolve({image: data, categoryId: categoryId})
            else return resolve({image: '', categoryId: categoryId})
        })
    })
  }

  useEffect(() => {
    if (categories && categories.length > 0) {
        let idImagePairs: {[key: string]: string} = {};
        Promise.all(categories.map(async c => {
            if (c.image) return await getCategoryImage(c.categoryId!, c.image!)
            else return ({[`${c.categoryId}`]: ''})
        }))
        .then(data => {
            (data as any[]).forEach((item, idx) => {
                idImagePairs[`${item.categoryId}`] = item.image
                if (idx === data.length - 1) { setCategoriesImages(idImagePairs) }
            });
        })
    }
  }, [categories])

  //modal
  useEffect(() => {
    if (modalShown === false) setCategoryToDelete(null);
  }, [modalShown]);

  useEffect(() => {
    if (actionConfirmed && categoryToDelete) {
        dispatch(deleteCategory(categoryToDelete, token!));
        setActionConfirmed(false);
    }
  }, [actionConfirmed, token, categoryToDelete, dispatch]);





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
                    categories.map(category => (<ListGroup.Item key={category.categoryId}>
                        <div className='w-100 d-flex align-items-center justify-content-between'>
                            <div className='d-flex align-items-center pointer' onClick={() => navigate(`/categories/${category.categoryId}`)}>
                                { 
                                    category.image && categoriesImages && categoriesImages[`${category.categoryId}`] !== ''
                                    ?
                                    <div className='category-thumbnail' style={{backgroundImage: `url(${categoriesImages[`${category.categoryId}`]})`}} />
                                    :
                                    <div className='category-thumbnail' />
                                }
                                <p>{category.name}</p>
                            </div>
                            {
                                user?.user?.role === 'admins'
                                &&
                                <div className='d-flex'>
                                    <p title='delete' className='m-1 pointer' onClick={() => {setModalShown(true); setCategoryToDelete(category.categoryId!)}}> <FaTrash /> </p>
                                    <p title='edit' className='m-1 pointer' onClick={() => navigate(`/admin/categoryform?action=update&categoryId=${category.categoryId}`)}> <FaPenFancy /> </p>
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

export default CategoriesPage