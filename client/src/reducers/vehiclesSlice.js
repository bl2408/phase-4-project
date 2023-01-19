import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	items: [],
};

//get vehicles list
export const fetchVehiclesList = createAsyncThunk('vehicles/fetchVehiclesList', async (_, { rejectWithValue }) => {
	const response = await fetch("/api/vehicles");
	const data = await response.json();
	if (!response.ok) {
		return rejectWithValue(data.errors)
	}
	return data;
});


export const vehiclesSlice = createSlice({
	name: 'vehiclesList',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchVehiclesList.fulfilled, (state, action) => {
			state.items = [
                ...action.payload.data
            ]
		})
    }
});

export default vehiclesSlice.reducer