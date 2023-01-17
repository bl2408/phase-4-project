import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: "light"
};

export const themeSlice = createSlice({
	name: 'toggle',
	initialState,
	reducers:{
		toggleTheme:(state)=>{
			state.value = state.value === "dark" ? "light" : "dark"
		},
		setTheme:(state, action)=>{
			state.value = action.payload;
		}
	}
});

export const { toggleTheme, setTheme } = themeSlice.actions

export default themeSlice.reducer