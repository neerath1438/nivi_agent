import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: localStorage.getItem('theme') || 'theme-light',
    customGradient: '',
    isThemeAnimated: false,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'theme-light' ? 'theme-dark' : 'theme-light';
            localStorage.setItem('theme', state.theme);
        },
        setCustomGradient: (state, action) => {
            state.customGradient = action.payload;
        },
        setIsThemeAnimated: (state, action) => {
            state.isThemeAnimated = action.payload;
        },
    },
});

export const { setTheme, toggleTheme, setCustomGradient, setIsThemeAnimated } = themeSlice.actions;

export default themeSlice.reducer;
