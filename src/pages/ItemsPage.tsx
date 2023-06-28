import React, { useEffect, useState, useContext, useCallback } from 'react';
import { UserContext } from '../context/UserContext';

import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTags } from '../actions/tagActions';
import { fetchCategories } from '../actions/categoryActions';
import { fetchItems, deleteItem } from '../actions/itemActions';
import { getS3Object } from '../helpers/getS3Object';

import { ItemModel } from '../models/models';

import { Button } from 'react-bootstrap';
import FilterAccordion from '../components/FilterAccordion';
import ConfirmModal from '../components/modals/ConfirmModal';

import { FaTrash } from 'react-icons/fa';




const ItemsPage = () => {
    //VALUES
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch(); //dispatch like e.g.: dispatch(changeMessage('No tags found'));
    const reduxMessage = useSelector((state: RootState) => state.message);
    const tags = useSelector((state: RootState) => state.tags);
    const categories = useSelector((state: RootState) => state.categories);
    const [categoriesImages, setCategoriesImages] = useState<{[key: string]: string} | null>(null);
    const items = useSelector((state: RootState) => state.items);
    const [itemsImages, setItemsImages] = useState<{[key: string]: string} | null>(null);
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const [modalShown, setModalShown] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>('');
    const [actionConfirmed, setActionConfirmed] = useState(false);



    //METHODS
    //get items, categories and tags
    useEffect(() => {
        dispatch(fetchTags());
        dispatch(fetchCategories());
        dispatch(fetchItems(null))
    }, [dispatch]);

    //get categories images
    const getCategoryImage = async (categoryId: string, image: string) => {
        return new Promise((resolve, reject) => {
            getS3Object(image).then(data => {
                if (!data.error) return resolve({image: data, categoryId: categoryId})
                else return resolve({image: '', categoryId: categoryId})
            })
        })
    }

    useEffect(() => {
        if (categories.length > 0) {
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

    //get items images
    const getItemImage = async (itemId: string, image: string) => {
        return new Promise((resolve, reject) => {
            getS3Object(image).then(data => {
                if (!data.error) return resolve({image: data, itemId: itemId})
                else return resolve({image: '', itemId: itemId})
            })
        })
    }

    useEffect(() => {
        if (items.length > 0) {
            let idImagePairs: {[key: string]: string} = {};
            Promise.all(items.map(async itm => {
                if (itm.mainImage) return await getItemImage(itm.itemId!, itm.mainImage!)
                else return ({[`${itm.itemId}`]: ''})
            }))
            .then(data => {
                (data as any[]).forEach((item, idx) => {
                    idImagePairs[`${item.itemId}`] = item.image;
                    console.log(data)
                    if (idx === data.length - 1) { setItemsImages(idImagePairs) }
                });
            })
        }
    }, [items])


    //populate item's category with category.name & category.image
    const getCategoryImageLink = (categoryId: string) => {
        if (categoriesImages && categoriesImages[`${categoryId}`]) {
            return categoriesImages[`${categoryId}`]
        }
        else return ''
    }

    const populateItemsCategory = (categoryId: string) => {
        if (categories.length) {
            let idx = categories.findIndex(c => c.categoryId === categoryId);
            if (idx !== -1) {
                return { category: categoryId, name: categories[idx].name, image: categories[idx].image ? getCategoryImageLink(categoryId) : '' };
            } else {
                return { category: categoryId, name: 'Error - category not found', image: '' }
            }
        } else {
            return { category: categoryId, name: 'Error - category not found', image: '' }
        }
    }

    //populate item's tag with tag.name
    const populateItemsTag = (tagId: string) => {
        if (tags.length) {
            let idx = tags.findIndex(t => t.tagId === tagId);
            if (idx !== -1) {
                return { tagId, name: tags[idx].name }
            } else {
                return { tagId, name: 'Error - tag not found' }
            }
        } else {
            return { tagId, name: 'Error - tag not found' }
        }
    }

    //delete item modal
    useEffect(() => {
        if (modalShown === false) setItemToDelete(null);
    }, [modalShown]);

    useEffect(() => {
        if (actionConfirmed && itemToDelete) {
            dispatch(deleteItem(itemToDelete, user!.token!));
            setActionConfirmed(false);
        }
      }, [actionConfirmed, user, itemToDelete, dispatch]);
    


    //RENDER
    const getItemImageLink = (itemId: string) => {
        if (itemsImages && itemsImages[`${itemId}`]) {
            return itemsImages[`${itemId}`]
        }
        else return ''
    }

    const renderItems = useCallback(() => {
        return (
                    items.map(item => (
                        <div className='single-item-container mb-5 col-md-4' key={item.itemId} style={{position: `relative`}}>
                            {/* ITEM IMAGE */}
                            { 
                                item.mainImage
                                ?
                                <div className='pointer' style={{width: '100%', height: `400px`, background: `url(${getItemImageLink(item.itemId!)}) no-repeat center center/cover`}} onClick={() => navigate(`/items/${item.itemId}`)} />
                                :
                                <div className='d-flex align-items-center justify-content-center w-100 pointer' style={{height: `400px`, background: '#eee'}} onClick={() => navigate(`/items/${item.itemId}`)} /> 
                            }

                            {/* ITEM NAME */}
                            <h4 style={{position: `absolute`, top: 5, left: 25, textShadow: '0 0 5px #eee'}} className='pointer' onClick={() => navigate(`/items/${item.itemId}`)}>{item.name}</h4>

                            {/* CATEGORY AND TAGS CIRCLES */}
                            <div className='item-circles-container my-1' style={{position: `absolute`, bottom: 5, left: 25, width: `75%`}}>
                                { 
                                    populateItemsCategory(item.category as string).image 
                                    ? 
                                    <div className='category-or-tag-circle' style={{background: `url(${populateItemsCategory(item.category as string).image}) no-repeat center center/cover`, transform: `rotate(0deg)`}} />
                                    :
                                    <div className='category-or-tag-circle'>
                                        <p>{populateItemsCategory(item.category as string).name}</p>
                                    </div>
                                }
                                {
                                    item.tags && item.tags.length > 0
                                    &&
                                    item.tags.map(t => (
                                        <div key={item.itemId! + (t as string)} className='category-or-tag-circle'>
                                            <p>{populateItemsTag(t as string).name}</p>
                                        </div>
                                    ))
                                }
                                {
                                    ((user && user.user && user.user.username ) || (user && user.user && user.user.role === 'admins'))
                                    &&
                                    <div className='category-or-tag-circle bg-dark pointer' style={{transform: 'rotate(0deg)'}}>
                                        <FaTrash 
                                            style={{transform: 'scale(1.25)'}}
                                            onClick={() => {setModalShown(true); setItemToDelete(item.itemId!)}}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    ))
        )
    }, [items, categoriesImages, itemsImages]);

    return (
        <div className='container text-center'>
            <h1>Items Page</h1>

            <br /><br /><br />

            {
                categories && categories.length > 0
                &&
                <FilterAccordion />
            }

            {
                user?.user?.email
                &&
                <Button variant="primary" className="mt-3 col-12" onClick={() => navigate('/admin/itemform')}>Create New Item</Button>
            }

            <div className='items-container row mt-5'>
                {
                    items && tags && categories
                    &&
                    <div className="row">
                        {renderItems()}
                    </div>
                }
            </div>

            <ConfirmModal show={modalShown} onHide={() => setModalShown(false)} setActionConfirmed={setActionConfirmed} />
        </div>
    )
}

export default ItemsPage