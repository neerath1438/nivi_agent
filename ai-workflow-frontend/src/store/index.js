import { configureStore } from '@reduxjs/toolkit';
import workflowReducer from './workflowSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
    reducer: {
        workflow: workflowReducer,
        theme: themeReducer,
    },
});
