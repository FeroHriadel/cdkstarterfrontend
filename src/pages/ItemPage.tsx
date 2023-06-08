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



    //METHODS
    useEffect(() => {
        setMessage('Getting Item...')
        getItemById(itemId!).then(data => {
            if (data.error) setMessage('Could not get Item');
            else { setItem(data); setMessage(''); console.log(data) }
        })
    }, [itemId]);

    


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
                    <aside className="col-md-6">
                        {
                            item.mainImage
                            ?
                            <img src={item.mainImage} style={{width: '100%'}} />
                            :
                            <div className='w-100 bg-dark d-flex justify-content-center align-items-center' style={{height: '100%'}}>
                                <h4 className='text-center'>This item has no image yet</h4>
                            </div>
                        }
                    </aside>

                    <main className="col-md-6">
                        <h4>{item.name}</h4>
                        <ul>
                            <li>{item.createdBy}</li>
                        </ul>
                    </main>
                </div>
            }
        </div>
    )
}

export default ItemPage