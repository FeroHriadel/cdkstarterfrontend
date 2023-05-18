import { changeMessage } from "../slices/messageSlice";
import { CategoryModel } from "../models/models";
import { getCategories, updateCategories, removeCategory } from "../slices/categoriesSlice";



const api = process.env.REACT_APP_API;



export const fetchCategories = () => async (dispatch: any) => {
    try {
        dispatch(changeMessage('Getting categories...'));
        const res = await fetch(`${api}/categories`);
        if (!res.ok) throw new Error('Failed to get response (`/categories`)');
        const data = await res.json();
        if (data && data.error) throw new Error(`${data.error}`);
        dispatch(getCategories(data));
        dispatch(changeMessage(''));
    } catch (error) {
        console.log(error);
        dispatch(changeMessage(JSON.stringify(error)));
        setTimeout(() => { dispatch(changeMessage('')) }, 2000);
    }
}



export const createCategory = async (category: CategoryModel, token: string | undefined) => {
    try {
        const res = await fetch(`${api}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(category)
        })
        const data = await res.json();
        if (data && data.error) return { error: data.error }
        return { ok: true, data }
        
    } catch (error) {
        console.log(error);
        return { error: 'Category creation failed' };
    }
}



export const getCategoryById = async (categoryId: string) => {
    return fetch(`${api}/categories?categoryId=${categoryId}`)
        .then(res => { return res.json() })
        .catch(err => {
            console.log(err);
            return {error: JSON.stringify('Something went wrong')}
        })
}



export const updateCategory = (category: CategoryModel, token: string) => {
    return fetch(`${api}/categories`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
    .then(res =>  res.json() )
    .catch(error => {
        console.log(error);
        return { error: 'Updating category failed' };
    })
}



export const deleteCategory = (categoryId: string, token: string) => async (dispatch: any) => {
    try {
        dispatch(changeMessage('Deleting category...'));
        const res = await fetch(`${api}/categories?categoryId=${categoryId}`, {
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
        dispatch(removeCategory(categoryId));
        dispatch(changeMessage('Category deleted'));
        setTimeout(() => {dispatch(changeMessage(''))}, 1000);

    } catch (error) {
        console.log(error);
        dispatch(changeMessage(JSON.stringify(error)));
        setTimeout(() => {dispatch(changeMessage(''))}, 2000);
    }
}