import { TagModel } from "../models/models";
import { changeMessage } from "../slices/messageSlice";
import { getTags, updateTags, removeTag } from "../slices/tagsSlice";



const api = process.env.REACT_APP_API;



export const fetchTags = () => async (dispatch: any) => {
    try {
        dispatch(changeMessage('Getting tags...'));
        const res = await fetch(`${api}/gettags`);
        if (!res.ok) throw new Error('Failed to get response (`/gettags`)');
        const data = await res.json();
        if (data && data.error) throw new Error(`${data.error}`);
        dispatch(getTags(data));
        dispatch(changeMessage(''));
    } catch (error) {
        console.log(error);
        dispatch(changeMessage(JSON.stringify(error)));
        setTimeout(() => { dispatch(changeMessage('')) }, 2000);
    }
}



export const createTag = async (tagName: string, token: string | undefined) => {
    try {
        const res = await fetch(`${api}/createtag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name: tagName})
        })
        const data = await res.json();
        if (data && data.error) return { error: data.error }
        return { ok: true, data }
        
    } catch (error) {
        console.log(error);
        return { error: 'Tag creation failed' };
    }
}



export const getTagById = async (tagId: string) => {
    return fetch(`${api}/gettag/${tagId}`)
        .then(res => { return res.json() })
        .catch(err => {
            console.log(err);
            return {error: JSON.stringify('Something went wrong')}
        })
}



export const updateTag = (name: string, tagId: string, token: string) => async (dispatch: any) => {
    try {
        dispatch(changeMessage('Updating tag...'));
        const res = await fetch(`${api}/updatetag/${tagId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name})
        });
        const data = await res.json();
        if (data && data.error) { 
            console.log(data.error);
            dispatch(changeMessage(data.error)); 
            setTimeout(() => { dispatch(changeMessage('')) }, 2000);
            return
        }
        dispatch(updateTags(data));
        dispatch(changeMessage('Tag updated'));
        setTimeout(() => {dispatch(changeMessage(''))}, 1000);

    } catch (error) {
        console.log(error);
        dispatch(changeMessage(JSON.stringify(error)));
        setTimeout(() => {dispatch(changeMessage(''))}, 2000);
    }
}



export const deleteTag = (tagId: string, token: string) => async (dispatch: any) => {
    try {
        dispatch(changeMessage('Deleting tag...'));
        const res = await fetch(`${api}/deletetag/${tagId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (data && data.error) {
            console.log(data.error);
            dispatch(changeMessage(data.error)); 
            setTimeout(() => { dispatch(changeMessage('')) }, 2000);
            return
        }
        dispatch(removeTag(tagId));
        dispatch(changeMessage('Tag deleted'));
        setTimeout(() => {dispatch(changeMessage(''))}, 1000);

    } catch (error) {
        console.log(error);
        dispatch(changeMessage(JSON.stringify(error)));
        setTimeout(() => {dispatch(changeMessage(''))}, 2000);
    }
}