import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TagModel } from '../models/models';



type TagsState = TagModel[];
const initialState: TagsState = [];



export const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        getTags: (state, action: PayloadAction<TagModel[]>) => {
            return state = [...action.payload]; //use `return` when you reassign the state value
        },
        updateTags: (state, action: PayloadAction<TagModel>) => {
            const idx = state.findIndex(item => item.tagId === action.payload.tagId);
            state = state.splice(idx, 1, action.payload);
        },
        removeTag: (state, action: PayloadAction<string>) => {
            return state.filter(tag => tag.tagId !== action.payload);
        }
    }
});



export const { getTags, updateTags, removeTag } = tagsSlice.actions;
export default tagsSlice.reducer;