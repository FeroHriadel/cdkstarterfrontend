import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTags, deleteTag } from '../actions/tagActions';
import { ListGroup, Button } from 'react-bootstrap';
import ConfirmModal from '../components/modals/ConfirmModal';
import { FaTrash, FaPenFancy } from "react-icons/fa";



const TagsPage = () => {
    //VALUES
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch(); //dispatch like e.g.: dispatch(changeMessage('No tags found'));
    const message = useSelector((state: RootState) => state.message);
    const tags = useSelector((state: RootState) => state.tags);
    const [modalShown, setModalShown] = useState(false);
    const [actionConfirmed, setActionConfirmed] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<string | null>(null);
    const { user } = useContext(UserContext);
    const token = user?.token;



    //METHODS
    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    useEffect(() => {
        if (modalShown === false) setTagToDelete(null);
    }, [modalShown]);

    useEffect(() => {
        if (actionConfirmed && tagToDelete) {
            dispatch(deleteTag(tagToDelete, token!));
            setActionConfirmed(false);
        }
    }, [actionConfirmed, token, tagToDelete, dispatch]);

    

    //RENDER
    return (
        <div className='container'>
            <h1 className='text-center'>Tags Page</h1>

            <br /><br /><br />

            <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <p className='text-center message'>{message}</p>
            </div>

            <ListGroup>
                <ListGroup.Item className='text-center text-light bg-primary' style={{position: 'relative'}}> 
                    <h5 className='text-center'>TAGS</h5>
                    {
                        user?.user?.role === 'admins'
                        &&
                        <Button 
                            style={{position: 'absolute', top: '50%', right: '1px', transform: 'translateY(-50%)'}}
                            onClick={() => navigate('/admin/tagform')}
                        >
                            <b>+</b>
                        </Button>
                    }
                </ListGroup.Item>
                {
                    tags
                    &&
                    tags.map(tag => (<ListGroup.Item key={tag.tagId} className='pointer d-flex justify-content-between'>
                        <p>{tag.name}</p>
                        {
                            user?.user?.role === 'admins'
                            &&
                            <div className='d-flex'>
                                <p title='delete' className='m-1' onClick={() => {setModalShown(true); setTagToDelete(tag.tagId)}}> <FaTrash /> </p>
                                <p title='edit' className='m-1' onClick={() => navigate(`/admin/tagform?action=update&tagId=${tag.tagId}`)}> <FaPenFancy /> </p>
                            </div> 
                        }
                    </ListGroup.Item>))
                }
            </ListGroup>

            <ConfirmModal show={modalShown} onHide={() => setModalShown(false)} setActionConfirmed={setActionConfirmed} />

        </div>
    )
}

export default TagsPage