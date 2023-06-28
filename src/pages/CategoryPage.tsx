import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryById } from '../actions/categoryActions';
import { Button } from 'react-bootstrap';
import { CategoryModel } from '../models/models';
import { getS3Object } from '../helpers/getS3Object';



const CategoryPage = () => {
    //VALUES
    const params = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState<CategoryModel | null>(null);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState<any>(null);



    //METHODS
    //get category
    useEffect(() => {
        setMessage('Getting Category...');
        getCategoryById(params.categoryId!).then(result => {
            if (result && result.error) setMessage(result.error);
            else { setCategory(result); setMessage(''); }
        });
    }, []);

    //get category image
    useEffect(() => {
        if (category && category.image) getS3Object(category.image)
        .then(data => {
            if (!data.error) setImage(data);
        })
    }, [category]);



    //RENDER
    return (
        <div className='container'>
            <h1 className='text-center'>{category ? category.name : 'Category Page'}</h1>
            <Button variant='secondary' onClick={() => navigate(-1)}>Go Back</Button>

            <br /><br /><br />

            <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <p className='text-center message'>{message}</p>
            </div>

            <div className="row">
                <div className='col-md-6 mb-5'>
                    {
                        category && image
                        ?
                        <img src={image} className=' w-100 img-fluid mb-3' style={{borderRadius: '10px'}} />
                        :
                        <h4 className='text-center'>This category has no image yet</h4>
                    }
                </div>

                <div className='col-md-6 mb-5'>
                    <h4>{category && category.name}</h4>
                    {
                        category && category.description
                        ?
                        <p>{category.description}</p>
                        :
                        <p>This category has no description yet</p>
                    }
                </div>
            </div>
            
        </div>
    )
}

export default CategoryPage