import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchCategories } from '../actions/categoryActions';
import { Form, Button } from 'react-bootstrap';
import { ItemModel, CategoryModel } from '../models/models';
import TagsSelect from '../components/forms/TagsSelect';
import { changeMessage } from '../slices/messageSlice';
import { saveItem } from '../actions/itemActions';
import LoggedInOnly from '../components/routeGuards/LoggedInOnly';



//MODELS
const itemInitialState: ItemModel = {
    name: '',
    description: '',
    category: '',
    tags: [],
    mainImage: '',
    images: [],
    price: '',
    quantity: ''
};

interface ImageState { fileName: string; imageFile: any };
const imageInitialState: ImageState = {fileName: '', imageFile: null};





//REACT COMPONENT
const ItemFormPage = () => {
    //VALUES
    const [values, setValues] = useState<any>(itemInitialState); 
    const [formDisabled, setFormDisabled] = useState(false);
    const dispatch: AppDispatch = useDispatch(); //dispatch like e.g.: dispatch(changeMessage('No tags found'));
    const message = useSelector((state: RootState) => state.message);
    const categories: CategoryModel[] = useSelector((state: RootState) => state.categories);
    const { tags } = values; //thesr what user selected, TagsSelect has all tags from BE
    const { user } = useContext(UserContext);
    const token = user?.token;
    const [selectedMainImage, setSelectedMainImage] = useState<any>(null);
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [mainImageData, setMainImageData] = useState<ImageState>(imageInitialState);
    const [imagesData, setImagesData] = useState<ImageState[]>([]);
    const [imagesMessage, setImagesMessage] = useState('');
    const navigate = useNavigate();




    //METHODS
    //get categories
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    //form input handler
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values, [e.target.name]: e.target.value});
    };
    //form tags handler
    const handleTags = (tagId: string) => {
        let selectedTags = [...tags!];
        if (selectedTags.includes(tagId)) selectedTags = selectedTags.filter(t => t !== tagId);
        else selectedTags.push(tagId);
        setValues({...values, tags: selectedTags});
    }

    //main image input handler
    const onMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = (e.target && e.target.files && e.target.files.length) ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                setSelectedMainImage(reader.result); //to show img to user
                setMainImageData({fileName: file.name, imageFile: event.target?.result}); //img file data for file upload
                //Actually, I think reader.result and event.target.result are the same base64 thing ( `data:image/jpeg;base64,/9j/4AAQSkZJRg...` )
            };
            reader.readAsDataURL(file);
        }
    }

    //remove main image
    const removeMainImage = () => {
        setMainImageData(imageInitialState);
        setSelectedMainImage(null);
    }

    /* multiple image preview calls for a different approach => with the approach like in onMainImageUpload()
     it crashes with `Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'.` */

    //file to b64 converter
    const fileToBase64 = (file: File | Blob): Promise<string> => //gets file and returns base64 string => is then used  by onImagesUpload() forEach file
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => { resolve(reader.result as string); };
            reader.readAsDataURL(file);
            reader.onerror = reject;
    });

    //multiple images upload handler
    const onImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { //uses fileToBase64() above for eaxch selected file:
        const files = (e.target && e.target.files && e.target.files.length) ? e.target.files : null;
        if (files && files.length > 10) {
            setImagesMessage('Max 10 images limit exceeded');
            setTimeout(() => { setImagesMessage('') }, 1500);
            return
        }

        const tempFileList: { fileName: string, base64String: string }[] = []; //will push resulting data here
        await Promise.all(
            [].map.call(e.target.files, async (file: File) => { //using promises pushes file data in the array above
                tempFileList.push({
                    fileName: file.name,
                    base64String: file.type.indexOf('image') > -1 ? await fileToBase64(file) : '',
                });
            })
        );
        setSelectedImages(tempFileList.map(item => item.base64String));
        setImagesData(tempFileList.map(item => { return {fileName: item.fileName, imageFile: item.base64String}}));
    }

    //remove from additional images
    const removeFromSelectedImages = (idx: number) => {
        let newSelectedImages = [...selectedImages]; newSelectedImages.splice(idx, 1); setSelectedImages(newSelectedImages);
        let newImagesData = [...imagesData]; newImagesData.splice(idx, 1); setImagesData(newImagesData);

    }

    //submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!mainImageData.fileName && imagesData.length > 0) {
            dispatch(changeMessage('Canno submit additional images without main image'));
            setTimeout(() => { dispatch(changeMessage('')) }, 2000);
            return
        }

        if (!values.name) {
            dispatch(changeMessage('Name is required'));
            setTimeout(() => { dispatch(changeMessage('')) }, 2000);
            return
        }

        if (!values.category) {
            dispatch(changeMessage('Category is required'));
            setTimeout(() => { dispatch(changeMessage('')) }, 2000);
            return
        }

        if (!token) {
            dispatch(changeMessage('You must be signed in to submit an item'));
            setTimeout(() => { dispatch(changeMessage('')) }, 2000);
            return
        }

        dispatch(saveItem(values, mainImageData, imagesData, token!));
    }

    //clear form when item saved successfully
    useEffect(() => {
        if (message === 'Item saved') {
            setValues(itemInitialState);
            setSelectedMainImage(null);
            setSelectedImages([]);
            setMainImageData(imageInitialState);
            setImagesData([]);
        }
    }, [message])

    

    //RENDER
    return (
        <div className='container'>

            <LoggedInOnly />

            <h1 className='text-center'>Create Item Page</h1>
            <Button variant='secondary' onClick={() => navigate(-1)}>Go Back</Button>

            <br /><br /><br />

            <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <p className='text-center message'>{message}</p>
            </div>

            
            {
                categories && categories.length > 0
                &&
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <Form onSubmit={handleSubmit} style={{textAlign: 'left'}}>
                            
                            {/* name */}
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Name*</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Item name"
                                    value={values.name}
                                    name='name'
                                    onChange={handleChange}
                                    disabled={message !== ''}
                                />
                            </Form.Group>

                            {/* category select */}
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Category*</Form.Label>
                                <Form.Select value={values.category} onChange={(e) => {setValues({...values, category: e.target.value})}} disabled={message !== ''} >
                                    <option value=''>No category selected</option>
                                    {
                                        categories.map(c => (
                                            <option value={c.categoryId} key={c.categoryId}>{c.name}</option>
                                        ))
                                    }
                                    
                                </Form.Select>
                            </Form.Group>

                            {/* tags select */}
                            <React.Fragment>
                                <div style={{pointerEvents: message !== '' ? 'none' : 'auto'}} className="w-100">
                                    <Form.Label>Tags</Form.Label>
                                    <TagsSelect handleTags={handleTags} tags={tags! as any} /> <div className='mb-3'></div>
                                </div>
                            </React.Fragment>

                            {/* description */}
                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    placeholder="Description"
                                    value={values.description}
                                    name='description'
                                    onChange={handleChange}
                                    disabled={message !== ''}
                                />
                            </Form.Group>

                            {/* main image */}
                            <React.Fragment>
                                <Form.Label className='w-100'>Main Image</Form.Label>
                                {
                                    selectedMainImage
                                    && 
                                    <img src={selectedMainImage} className='img-fluid mb-3' style={{borderRadius: '10px'}} />
                                }
                                <label className="pointer w-100 btn btn-primary mb-3">
                                    Upload Image
                                    <input 
                                        name="image-input"
                                        id="image-input"
                                        type="file"
                                        accept="image/*"
                                        className="w-100"
                                        onChange={onMainImageUpload}
                                        hidden
                                        disabled={message !== ''}
                                    />
                                </label>
                                { selectedMainImage && <Button variant='primary' className='col-12 mb-3' onClick={removeMainImage}>Remove Main Image</Button> }
                            </React.Fragment>

                            {/* additional images */}
                            <React.Fragment>
                                <Form.Label className='w-100'>Additional Images</Form.Label>
                                <div className='selected-image-thumbnails-container'>
                                    {
                                        selectedImages.length > 0
                                        &&
                                        selectedImages.map((image, idx) => (
                                            <div className='selected-image-thumbnail' key={`selected-image-${idx}`} style={{backgroundImage: `url(${image})`}}>
                                                <div className='remove-image-button' onClick={() => {removeFromSelectedImages(idx)}}>
                                                    <p>x</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                
                                <p className='text-center message'>{imagesMessage}</p>
                                
                                <label className="pointer w-100 btn btn-primary mb-3">
                                    Upload Images
                                    <input 
                                        name="images-input"
                                        id="images-input"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="w-100"
                                        onChange={onImagesUpload}
                                        hidden
                                        disabled={message !== ''}
                                    />
                                </label>
                            </React.Fragment>

                            {/* price */}
                            <Form.Group className="mb-3" controlId="formPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control 
                                    type="number"
                                    placeholder="Item price"
                                    value={values.price}
                                    name='price'
                                    onChange={handleChange}
                                    disabled={message !== ''}
                                />
                            </Form.Group>

                            
                            {/* quantity */}
                            <Form.Group className="mb-3" controlId="formQuantity">
                                <Form.Label>Price</Form.Label>
                                <Form.Control 
                                    type="number"
                                    placeholder="Quantity"
                                    value={values.quantity}
                                    name='quantity'
                                    onChange={handleChange}
                                    disabled={message !== ''}
                                />
                            </Form.Group>

                            {/* bottom message */}
                            <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                <p className='text-center message'>{message}</p>
                            </div>

                            {/* submit button */}
                            <Button variant="primary" type="submit" className='col-12 mb-5' disabled={message !== ''}>
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            }

        </div>
    )
}

export default ItemFormPage