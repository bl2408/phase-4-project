import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
	loggedIn: false,
	user: {}
};
//login user
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

//relogin by session
export const fetchCheck = createAsyncThunk('users/fetchCheck', async (_, { rejectWithValue }) => {
	const response = await fetch("/api/check");
	const data = await response.json();
	if (!response.ok) {
		return rejectWithValue(data.errors)
	}
	return data;
});

//logout
export const fetchLogout = createAsyncThunk('users/fetchLogout', async (_, { rejectWithValue }) => {
	const response = await fetch("/api/logout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
	});
	
	if (!response.ok) {
		const data = await response.json();
		return rejectWithValue(data.errors)
	}
	return true;
});

export const userSlice = createSlice({
	name: 'user',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchLogin.fulfilled, (state, action) => {
			state.user ={
				id: action.payload.data.id,
				...action.payload. data.attributes,
			}
			state.loggedIn = true;
		}),
		builder.addCase(fetchCheck.fulfilled, (state, action) => {
			state.user = {
				id: action.payload.data.id,
				...action.payload. data.attributes,
			}
			state.loggedIn = true;
		})
		builder.addCase(fetchLogout.fulfilled, (state, action) => {
			state.user = {};
			state.loggedIn = false;
		})
	},
});


export default userSlice.reducer