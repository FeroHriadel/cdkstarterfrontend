import { configureStore } from "@reduxjs/toolkit";
import tagsReducer from "./slices/tagsSlice"; //tagsSlice.ts exports no such thing => it must be something that reacttoolkit does
import messageReducer from "./slices/messageSlice";
import categoriesReducer from './slices/categoriesSlice';
import itemsReducer from './slices/itemsSlice';



export const store = configureStore({
    reducer: {
        message: messageReducer,
        tags: tagsReducer,
        categories: categoriesReducer,
        items: itemsReducer
    }
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;