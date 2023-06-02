import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ItemModel } from '../models/models';



type ItemsState = ItemModel[];
const initialState: ItemsState = [];



export const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        getItems: (state, action: PayloadAction<ItemModel[]>) => {
            return state = [...action.payload]; //use `return` when you reassign the state value
        },
        updateItems: (state, action: PayloadAction<ItemModel>) => {
            const idx = state.findIndex(item => item.itemId === action.payload.itemId);
            state = state.splice(idx, 1, action.payload);
        },
        removeItem: (state, action: PayloadAction<string>) => {
            return state.filter(item => item.itemId !== action.payload);
        }
    }
});



export const { getItems, updateItems, removeItem } = itemsSlice.actions;
export default itemsSlice.reducer;