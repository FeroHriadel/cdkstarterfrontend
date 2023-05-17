import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { RootState, AppDispatch } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { createCategory, getCategoryById, updateCategory } from '../actions/categoryActions';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSignedUrl } from '../actions/imagesActions';
import { Form, Button } from 'react-bootstrap';



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
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [imageData, setImageData] = useState<{fileName: string, imageFile: any}>({fileName: '', imageFile: null});
    const { fileName, imageFile } = imageData;
    const [message, setMessage] = useState('');
    const reduxMessage = useSelector((state: RootState) => state.message);
    const dispatch: AppDispatch = useDispatch();
    const [existingCategoryImage, setExistingCategoryImage] = useState('');



    //METHODS
    useEffect(() => {
        if (updatingCategory) {
            setFormDisabled(true);
            setMessage('Getting Category...');
            getCategoryById(categoryId!).then(result => {
                if (result && result.error) setMessage(result.error);
                else {
                    setValues({name: result.name, description: result.description || ''});
                    result.image && setExistingCategoryImage(result.image);
                }
                setFormDisabled(false);
                setMessage('');
            })
        }
    }, [])

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage('');
        setValues({...values, [e.target.name]: e.target.value});
    }

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

    const saveCategoryWithImage = () => {
        //get the pre-signedUrl to pushe the image to:
        getSignedUrl(fileName, token!).then(data => {
            if (data.error || !data.url) { setMessage('Could not upload image'); setFormDisabled(false); return }

            //the pre-signed link to S3 Bucket: {url: "https://cdk-starter-images-bucket-fero.s3.amazonaws.com/Matus.jpg5733.png?AWSAccessKeyId=ASIAU..."}
            const url = data.url;
            let objectUrl = url.split('?')[0]; //aws link where image will be. AWS calls it objectUrl hence the name

            //do some file-to-base64 magic to get blobData
            let binary = atob(imageFile.split(',')[1]); //removes the image/png from image file
            let array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i)) //pushes imageFile characters into the array
            }
            let blobData = new Blob([new Uint8Array(array)], {type: 'image/png'});

            //push blobData to presigned link
            fetch(url, {method: 'PUT', body: blobData}).then(res => {
                if (!res.ok) {
                    setMessage('Saving image failed');
                    setFormDisabled(false);
                    return
                }
                
                //save category to db
                console.log(objectUrl); //this is the url the image was uploaded to
                createCategory({name, description, image: objectUrl}, token!).then(result => {
                    if (result && result.error) setMessage(result.error);
                    else setMessage('Category Created');
                    setFormDisabled(false);
                })
            })
        })
    }

    const saveCategoryWithoutImage = () => {
        createCategory({name, description}, token!).then(result => {
            if (result && result.error) setMessage(result.error);
            else setMessage('Category Created');
            setFormDisabled(false);
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); if (!name) return setMessage('Name is required'); 
        setFormDisabled(true); setMessage('Saving category...');
        if (updatingCategory) {
            dispatch(updateCategory({...values, categoryId: categoryId!}, token!));
            setTimeout(() => {setFormDisabled(false)}, 2000);
        } else {
            if (imageFile) saveCategoryWithImage();
            else saveCategoryWithoutImage();
        }
    }

    



    //RENDER
    return (
        <div className='container'>
            <h1 className='text-center'>Create Category</h1>
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
                                type="text" 
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