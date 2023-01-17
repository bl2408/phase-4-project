import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	loggedIn: false,
	user: {}
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers:{
		setUser:(state, action)=>{
			state.user = action.payload;
		},
		setLoggedIn:(state, action)=>{
			state.loggedIn = action.payload;
		}
	}
});

export const { setUser, setLoggedIn } = userSlice.actions

export default userSlice.reducer