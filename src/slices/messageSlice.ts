import { createSlice, PayloadAction } from '@reduxjs/toolkit';



type MessageModel = string;
const initialState: MessageModel = '';



export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        changeMessage: (state, action: PayloadAction<MessageModel>) => {
            return state = action.payload; 
        }
    }
});



export const { changeMessage } = messageSlice.actions;
export default messageSlice.reducer;