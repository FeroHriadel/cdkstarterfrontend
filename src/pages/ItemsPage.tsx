import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTags } from '../actions/tagActions';
import { fetchCategories } from '../actions/categoryActions';
import { fetchItems } from '../actions/itemActions';

import { ItemModel } from '../models/models';




const ItemsPage = () => {
    //VALUES
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch(); //dispatch like e.g.: dispatch(changeMessage('No tags found'));
    const reduxMessage = useSelector((state: RootState) => state.message);
    const tags = useSelector((state: RootState) => state.tags);
    const categories = useSelector((state: RootState) => state.categories);
    const items = useSelector((state: RootState) => state.items);
    const [message, setMessage] = useState('');



    //METHODS
    //get items, categories and tags
    useEffect(() => {
        dispatch(fetchTags());
        dispatch(fetchCategories());
        dispatch(fetchItems(null))
    }, [dispatch]);

    //populate item's category with category.name & category.image
    const populateItemsCategory = (categoryId: string) => {
        if (categories.length) {
            let idx = categories.findIndex(c => c.categoryId === categoryId);
            if (idx !== -1) {
                return { category: categoryId, name: categories[idx].name, image: categories[idx].image ? categories[idx].image : '' };
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
    


    //RENDER
    const renderItems = useCallback(() => {
        return (
                    items.map(item => (
                        <div className='single-item-container mb-5 col-12' key={item.itemId} style={{position: `relative`}} >
                            {/* ITEM IMAGE */}
                            { 
                                item.mainImage
                                ?
                                <img src={item.mainImage} style={{width: `100%`}} />
                                :
                                <div className='d-flex align-items-center justify-content-center w-100' style={{height: `400px`, background: '#eee'}} /> 
                            }

                            {/* ITEM NAME */}
                            <h4 style={{position: `absolute`, top: 5, left: 25}}>{item.name}</h4>

                            {/* CATEGORY AND TAGS CIRCLES */}
                            <div className='item-circles-container my-1' style={{position: `absolute`, bottom: 5, left: 25}}>
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
                            </div>
                        </div>
                    ))
        )
    }, [items]);

    return (
        <div className='container text-center'>
            <h1>Items Page</h1>

            <br /><br /><br />

            <button onClick={() => navigate('/items/itemform')}>form</button>

            <div className='items-container row'>
                {
                    items && tags && categories
                    &&
                    renderItems()
                }
            </div>
        </div>
    )
}

export default ItemsPage