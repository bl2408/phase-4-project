import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	items: [],
};

//get categories list
export const fetchCategoriesList = createAsyncThunk('categories/fetchCategoriesList', async (_, { rejectWithValue }) => {
	const response = await fetch("/api/list/categories");
	const data = await response.json();
	if (!response.ok) {
		return rejectWithValue(data.errors)
	}
	return data;
});


export const categorySlice = createSlice({
	name: 'categorySlice',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchCategoriesList.fulfilled, (state, action) => {
			state.items = action.payload 
		})
    }
});

export default categorySlice.reducer