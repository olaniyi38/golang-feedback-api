import { configureStore } from "@reduxjs/toolkit";
import feedbacksSlice from "./feedbacks/feedbacksSlice";
import userSlice from "./user/userSlice";
import logger from 'redux-logger'



const store = configureStore({
    reducer: {
        feedbacks: feedbacksSlice,
        currentUser: userSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== "production"
});


export default store 