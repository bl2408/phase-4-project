import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	loggedIn: false,
	user: {}
};

export const fetchLogin = createAsyncThunk('users/fetchLogin', async (formObj, { rejectWithValue }) => {
	const response = await fetch("/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(formObj)
	});

	const data = await response.json();
	if (!response.ok) {
		return rejectWithValue(data.errors)
	}
	return data;
});

export const userSlice = createSlice({
	name: 'user',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchLogin.fulfilled, (state, action) => {
			state.user = action.payload;
			state.loggedIn = true;
		})
	},
});

// export const { setUser, setLoggedIn, setUserAll } = userSlice.actions

export default userSlice.reducer