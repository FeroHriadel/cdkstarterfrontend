import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { RootState, AppDispatch } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { updateCategories } from '../slices/categoriesSlice';
import { createCategory, getCategoryById, updateCategory } from '../actions/categoryActions';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSignedUrl } from '../actions/imagesActions';
import { Form, Button } from 'react-bootstrap';
import { CategoryModel } from '../models/models';



const CategoryFormPage: React.FC = () => {
    //VALUES
    const location = useLocation();
    let search = location.search;
    const updatingCategory = search.includes('?action=update');
    const categoryId = updatingCategory ? search.split('categoryId=')[1] : null;

    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const token = user?.token;
    const [values, setValues] = useState({name: '', description: ''});
    const { name, description } = values;
    const [formDisabled, setFormDisabled] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null); //preview shown to user
    const [imageData, setImageData] = useState<{fileName: string, imageFile: any}>({fileName: '', imageFile: null}); //selectedImage data
    const { fileName, imageFile } = imageData;
    const [existingCategoryImage, setExistingCategoryImage] = useState(''); //(only if updating) image if category had any
    const [fetchedCategory, setFetchedCategory] = useState<CategoryModel | null>(null); //(only if updating) category that will be edited
    const [message, setMessage] = useState('');
    const reduxMessage = useSelector((state: RootState) => state.message);
    const dispatch: AppDispatch = useDispatch();



    //METHODS
    //if updating (not creating) fetch category
    useEffect(() => {
        if (updatingCategory) {
            setFormDisabled(true);
            setMessage('Getting Category...');
            getCategoryById(categoryId!).then(result => {
                if (result && result.error) setMessage(result.error);
                else {
                    setFetchedCategory(result);
                    setValues({name: result.name, description: result.description || ''});
                    result.image && setExistingCategoryImage(result.image);
                }
                setFormDisabled(false);
                setMessage('');
            })
        }
    }, [])

    //input change handler
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }

    //file input change handler
    const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = (e.target && e.target.files && e.target.files.length) ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setExistingCategoryImage(''); //stop showing existing category image if any
                setSelectedImage(reader.result); //to show img to user
                setImageData({fileName: file.name, imageFile: e.target?.result}); //img file data for file upload
            };
            reader.readAsDataURL(file);
        }
    }

    //push Blob data from file input to pre-signedUrl
    const pushImageToSignedUrl = (url: string) => {
        //remove search from signed url
        let objectUrl = url.split('?')[0]; //aws link where image will be. AWS calls it objectUrl hence the name

        //do some file-to-base64 magic to get blobData
        let binary = atob(imageFile.split(',')[1]); //removes the image/png from image file
        let array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i)) //pushes imageFile characters into the array
        }
        let blobData = new Blob([new Uint8Array(array)], {type: 'image/png'});

        //push blobData to presigned link
        return fetch(url, {method: 'PUT', body: blobData}).then(res => {
            if (!res.ok) {
                setMessage('Saving image failed');
                setFormDisabled(false);
                return {error: 'Pushing to signed url failed'}
            }
            return {objectUrl}
        })

    }

    //save category w/ image (takes care of all state updates too)
    const saveCategoryWithImage = () => {
        //get the pre-signedUrl to pushe the image to:
        getSignedUrl(fileName, token!).then(data => {
            if (data.error || !data.url) { setMessage('Could not upload image'); setFormDisabled(false); return }
            //the pre-signed link to S3 Bucket: {url: "https://cdk-starter-images-bucket-fero.s3.amazonaws.com/Matus.jpg5733.png?AWSAccessKeyId=ASIAU..."}
            const url = data.url;
            pushImageToSignedUrl(url).then(result => { //push image to pre-signedUrl
                if (result.objectUrl) {
                    console.log(result.objectUrl); //this is the url the image was uploaded to
                    createCategory({name, description, image: result.objectUrl}, token!).then(res => { //save category to db
                        if (res && res.error) setMessage(res.error);
                        else { setMessage('Category Created'); setValues({name: '', description: ''}); setImageData({fileName: '', imageFile: null}); setSelectedImage(null); }
                        setFormDisabled(false);
                    })
                }
            })
        })
    }

    //save category w/o image (takes care of all state updates too)
    const saveCategoryWithoutImage = () => {
        createCategory({name, description}, token!).then(result => {
            if (result && result.error) setMessage(result.error);
            else { setMessage('Category Created'); setValues({name: '', description: ''}); setImageData({fileName: '', imageFile: null}); setSelectedImage(null); }
            setFormDisabled(false);
        })
    }

    //update category (takes care of all state updates too)
    const updateExistingCategory: () => void = () => {
        setMessage('Updating category...');
        let updatedCategory: CategoryModel = {name, description, categoryId: categoryId! };

        //category had image and none was added
        if (existingCategoryImage) {
            updatedCategory.image = existingCategoryImage;
            updateCategory(updatedCategory, token!).then(data => {
                if (data && data.error) { setMessage(data.error); setTimeout(() => { setMessage(''); setFormDisabled(false); }, 1500); return }
                setMessage('Category updated'); setFormDisabled(false); setFetchedCategory({...data});
                dispatch(updateCategories(data));
                setTimeout(() => { setMessage(''); }, 2000);
            })
        }

        //category had image and it was changed
        else if (fetchedCategory && imageFile) {
            getSignedUrl(fileName, token!).then(data => {
                if (data.error || !data.url) { setMessage('Could not upload image'); setFormDisabled(false); setTimeout(() => { setMessage('') }, 1500); return }
                pushImageToSignedUrl(data.url).then(linkRes => {
                    if (!linkRes.objectUrl) { setMessage('Could not upload image'); setFormDisabled(false); setTimeout(() => { setMessage('') }, 1500); return }
                    updatedCategory.image = linkRes.objectUrl;
                    updateCategory(updatedCategory, token!).then(data => {
                        if (data && data.error) { setMessage(data.error); setTimeout(() => { setMessage(''); setFormDisabled(false); }, 1500); return }
                        setMessage('Category updated'); setFormDisabled(false); setFetchedCategory({...data});
                        setExistingCategoryImage(data.image); setImageData({fileName: '', imageFile: null}); setSelectedImage(null);
                        dispatch(updateCategories(data));
                        setTimeout(() => { setMessage(''); }, 2000);
                    })
                })
            })
        }

        //category didn't have image and none is added
        else if (fetchedCategory && !imageFile) {
            updateCategory(updatedCategory, token!).then(data => {
                if (data && data.error) { setMessage(data.error); setTimeout(() => { setMessage(''); setFormDisabled(false); }, 1500); return }
                setMessage('Category updated'); setFormDisabled(false); setFetchedCategory({...data});
                dispatch(updateCategories(data));
                setTimeout(() => { setMessage(''); }, 2000);
            })
        }
        //category din't have image but one is added
        else if (fetchedCategory && !fetchedCategory.image) {
            getSignedUrl(fileName, token!).then(data => {
                if (data.error || !data.url) { setMessage('Could not upload image'); setFormDisabled(false); setTimeout(() => { setMessage('') }, 1500); return }
                pushImageToSignedUrl(data.url).then(linkRes => {
                    if (!linkRes.objectUrl) { setMessage('Could not upload image'); setFormDisabled(false); setTimeout(() => { setMessage('') }, 1500); return }
                    updatedCategory.image = linkRes.objectUrl;
                    updateCategory(updatedCategory, token!).then(data => {
                        if (data && data.error) { setMessage(data.error); setTimeout(() => { setMessage(''); setFormDisabled(false); }, 1500); return }
                        setMessage('Category updated'); setFormDisabled(false); setFetchedCategory({...data});
                        setExistingCategoryImage(data.image); setImageData({fileName: '', imageFile: null}); setSelectedImage(null);
                        dispatch(updateCategories(data));
                        setTimeout(() => { setMessage(''); }, 2000);
                    })
                })
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); if (!name) return setMessage('Name is required'); setMessage('');
        if (updatingCategory) updateExistingCategory();
        else {
            setFormDisabled(true); setMessage('Saving category...');
            if (imageFile) saveCategoryWithImage();
            else saveCategoryWithoutImage();
        }
    }

    



    //RENDER
    return (
        <div className='container'>
            <h1 className='text-center'>{updatingCategory ? 'Update Category' : 'Create Category'}</h1>
            <Button variant='secondary' onClick={() => navigate(-1)}>Go Back</Button>

            <br /><br /><br />

            <main className='row'>
                <div className='col-md-6 offset-md-3'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name*</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Category name"
                                value={name}
                                name='name'
                                onChange={handleChange}
                                disabled={formDisabled}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea"
                                placeholder="Category description"
                                value={description}
                                name='description'
                                onChange={handleChange}
                                disabled={formDisabled}
                            />
                        </Form.Group>

                        {
                            selectedImage 
                            && 
                            <img src={selectedImage} className='img-fluid mb-3' style={{borderRadius: '10px'}} />
                        }

                        {
                            existingCategoryImage
                            &&
                            <img src={existingCategoryImage} className='img-fluid mb-3' style={{borderRadius: '10px'}} />
                        }

                        <label className="pointer w-100 btn btn-primary mb-3">
                            Upload Image
                            <input 
                                name="image-input"
                                id="image-input"
                                type="file"
                                max="1"
                                accept="image/*"
                                className="w-100"
                                onChange={onImageUpload}
                                hidden
                                disabled={formDisabled}
                            />
                        </label>

                        <Button variant="primary" type="submit" className='col-12' disabled={formDisabled}>
                            Submit
                        </Button>

                        <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                            <p className='text-center message'>{message || reduxMessage}</p>
                        </div>
                    </Form>

                </div>
            </main>

            

            
        </div>
    )
}

export default CategoryFormPage