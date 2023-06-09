import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getItemById } from '../actions/itemActions';

import { Button } from 'react-bootstrap';
import { ItemModel } from '../models/models';





const ItemPage = () => {
    //VALUES
    const navigate = useNavigate();
    const params = useParams();
    const itemId = params.itemId;
    const [message, setMessage] = useState('');
    const [item, setItem] = useState<ItemModel | null>(null);
    const [selectedImage, setSelectedImage] = useState('');



    //METHODS
    //get item
    useEffect(() => {
        setMessage('Getting Item...')
        getItemById(itemId!).then(data => {
            if (data.error) setMessage('Could not get Item');
            else { setItem(data); setMessage(''); console.log(data) }
        })
    }, [itemId]);

    //select image
    useEffect(() => {
        if (item && item.mainImage) setSelectedImage(item.mainImage);
    }, [item])



    //RENDER
    return (
        <div className='container'>
            <h1 className='text-center'>Item Page</h1>
            <Button variant='secondary' onClick={() => navigate(-1)}>Go Back</Button>

            <br /><br /><br />

            <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <p className='text-center message'>{message}</p>
            </div>

            {
                item
                &&
                <div className="row">
                    <aside className="col-md-6 mb-3">
                        {
                            selectedImage
                            ?
                            <img src={selectedImage} style={{width: '100%'}} className='mb-1' />
                            :
                            <div className='w-100 bg-dark d-flex justify-content-center align-items-center mb-1' style={{height: '100%'}}>
                                <h4 className='text-center'>This item has no image yet</h4>
                            </div>
                        }

                        {
                            item.images && item.images.length > 0
                            &&
                            <div className="w-100 d-flex justify-content-start" style={{flexWrap: 'wrap'}}>
                                <div 
                                    key={item.mainImage!}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        background: `url(${item.mainImage!}) no-repeat center center/cover`,
                                        margin: '0.1rem 0.2rem 0.1rem 0'
                                    }}
                                    onClick={() => {setSelectedImage(item.mainImage!)}}
                                />

                                {
                                    item.images.map(img => (
                                        <div 
                                            key={img}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                background: `url(${img}) no-repeat center center/cover`,
                                                margin: '0.1rem 0.2rem 0.1rem 0'
                                            }}
                                            onClick={() => {setSelectedImage(img)}}
                                        />

                                    ))
                                }
                            </div>
                        }
                    </aside>

                    <main className="col-md-6 mb-3">
                        <h4>{item.name}</h4>
                        <p><small><em>{(item.category! as {[key: string]: string}).name}</em></small></p>
                        <div className='w-100 d-flex justify-content-start tags-select-container'>
                            {
                                item.tags && item.tags.length > 0
                                &&
                                (item.tags as {[key: string]: string}[]).map(t => (
                                    <div className='tag-checkbox' key={t.tagId} id={t.tagId} style={{width: 35, height: 35}}>
                                        <p className='tag-checkbox-text' style={{fontSize: '0.6rem'}}>{t.name}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <br />
                        <ul>
                            <li>Added by {item.createdBy}</li>
                            {item.price && <li>Price: {item.price}</li>}
                            {item.quantity && <li>Quantity: {item.quantity}</li>}
                            <li>Last updated: {new Date(item.updatedAt!).toLocaleDateString('en-US')}</li>
                            {item.description && <li>{item.description}</li>}
                        </ul>
                    </main>
                </div>
            }
        </div>
    )
}

export default ItemPage