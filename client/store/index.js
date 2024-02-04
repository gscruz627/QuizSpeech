import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    quizes: []
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user; 
            state.token = action.payload.token
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setQuizes: (state, action) => {
            state.quizes = action.payload.quizes
        },
        setQuiz: (state, action) => {
            const updatedQuizes = state.quizes.map( (quiz) => {
                if (quiz._id === action.payload.quiz._id) return action.payload.quiz;
                return quiz;
            });
            state.quizes = updatedQuizes;
        }
    }
})

export const { setLogin, setLogout, setQuizes, setQuiz } = authSlice.actions;
export default authSlice.reducer;