import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryModel } from '../models/models';



type CategoriesState = CategoryModel[];
const initialState: CategoriesState = [];



export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        getCategories: (state, action: PayloadAction<CategoryModel[]>) => {
            return state = [...action.payload]; //use `return` when you reassign the state value
        },
        updateCategories: (state, action: PayloadAction<CategoryModel>) => {
            const idx = state.findIndex(item => item.categoryId === action.payload.categoryId);
            state = state.splice(idx, 1, action.payload);
        },
        removeCategory: (state, action: PayloadAction<string>) => {
            return state.filter(category => category.categoryId !== action.payload);
        }
    }
});



export const { getCategories, updateCategories, removeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;