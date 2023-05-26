import React, {useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchTags } from '../../actions/tagActions';



const TagsSelect: React.FC<{handleTags: (tagId: string) => void, tags: string[] }> = ({ handleTags, tags: selectedTags }) => {
    //VALUES
    const [message, setMessage] = useState('');
    const dispatch: AppDispatch = useDispatch(); //dispatch like e.g.: dispatch(changeMessage('No tags found'));
    const tagsFromDB = useSelector((state: RootState) => state.tags);
    const reduxMessage = useSelector((state: RootState) => state.message);
    


    //METHODS
    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    useEffect(() => {
        if (reduxMessage && (reduxMessage.includes('tag') || reduxMessage.includes('Tag'))) setMessage(reduxMessage);
        else setMessage('');
    }, [reduxMessage]);



    //RENDER
    return (
        <div className='w-100 d-flex justify-content-center tags-select-container'>
            {message && <p>{message}</p>}

            {
                tagsFromDB.length > 0
                &&
                tagsFromDB.map(t => (
                    <div className={selectedTags.includes(t.tagId) ? 'tag-checkbox selected-tag' : 'tag-checkbox'} key={t.tagId} id={t.tagId} onClick={() => {handleTags(t.tagId)}}>
                        <p className='tag-checkbox-text'>{t.name}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default TagsSelect