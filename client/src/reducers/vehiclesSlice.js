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

//delete vehicle by id
export const deleteVehicleById = createAsyncThunk('vehicles/deleteVehicleById', async (id, { rejectWithValue }) => {
	
	const response = await fetch(`/api/vehicles/${id}`,{
		method:"DELETE",
		headers:{
			"Content-Type": "application/json"
		}
	});

	if(!response.ok){
		const data = await response.json()
		return rejectWithValue(data.errors)
	}

	return { success: true, id };
});


export const vehiclesSlice = createSlice({
	name: 'vehiclesList',
	initialState,
	// 	deleteVehicleById:(state,action)=>{
	// 		const { id } = action.payload
	// 		console.log(state.items)
	// 		console.log(state.items.find(item=>item.id === id))
	// 	}
	// },
	extraReducers: (builder) => {
		builder.addCase(fetchVehiclesList.fulfilled, (state, action) => {
			state.items = [
                ...action.payload.data
            ]
		}),
		builder.addCase(deleteVehicleById.fulfilled, (state, action) => {
			state.items = state.items.filter(item=>item.id !== action.payload.id)
		})
    }
});

// export const { updateHistoryById } = vehiclesSlice.actions

export default vehiclesSlice.reducer