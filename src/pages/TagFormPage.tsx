import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createTag, getTagById, updateTag } from '../actions/tagActions';



const TagFormPage = () => {
    //VALUES
    const location = useLocation();
    let search = location.search;
    const updatingTag = search.includes('?action=update');
    const tagId = updatingTag ? search.split('tagId=')[1] : null;

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [formDisabled, setFormDisabled] = useState(false);
    const { user } = useContext(UserContext);
    const token = user?.token;
    const reduxMessage = useSelector((state: RootState) => state.message);
    const dispatch: AppDispatch = useDispatch();



    //METHODS
    useEffect(() => {
        if (updatingTag) {
            setFormDisabled(true);
            setMessage('Getting tag...');
            getTagById(tagId!).then(result => {
                if (result && result.error) setMessage(result.error);
                else setName(result.name);
                setFormDisabled(false);
                setMessage('');
            })
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormDisabled(true);
        if (updatingTag) {
            dispatch(updateTag(name, tagId!, token!));
            setTimeout(() => {setFormDisabled(false)}, 2000);
        } else {
            setMessage('Creating Tag...');
            const result = await createTag(name, token);
            if (result.error) setMessage(result.error);
            else setMessage('Tag Created');
            setFormDisabled(false);
        }
    }



    //RENDER 
    return (
        <div className='container'>
            <h1 className='text-center'>{updatingTag ? 'Edit Tag' : 'Create Tag'}</h1>
            <Button variant='secondary' onClick={() => navigate(-1)}>Go Back</Button>

            <br /><br /><br />

            <main className='row'>
                <div className='col-md-6 offset-md-3'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Tag name"
                                value={name}
                                name='name'
                                onChange={(e) => { setMessage(''); setName(e.target.value)}}
                                disabled={formDisabled}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className='col-12' disabled={formDisabled}>
                            Submit
                        </Button>
                    </Form>

                    <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <p className='text-center message'>{message || reduxMessage}</p>
                    </div>
                </div>
            </main>
            
        </div>
    )
}

export default TagFormPage