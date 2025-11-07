import { getCars } from "@/services/car-listing-service";
import { CarQueryParams, CarResponse } from "@/types/car-listing";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface CarState {
  cars: CarResponse | null;
  isLoading: boolean;
  error: string | null;
}
const initialState: CarState = {
  cars: null,
  isLoading: false,
  error: null,
};

export const fetchCars = createAsyncThunk<
  CarResponse,
  CarQueryParams,
  { rejectValue: string }
>("cars/fetchCars", async (params = {}, { rejectWithValue }) => {
  try {
    const data = await getCars(params);
    return data;
  } catch (error) {
    const apiError = error as Error;
    return rejectWithValue(apiError.message);
  }
});

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCars.fulfilled,
        (state, action: PayloadAction<CarResponse>) => {
          state.isLoading = false;
          state.cars = action.payload;
        }
      )
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch cars";
      });
  },
});

export default carSlice.reducer;

// selectors

export const selectCars = (state: { cars: CarState }) => state.cars.cars;
export const selectCarsLoading = (state: { cars: CarState }) =>  state.cars.isLoading;
export const selectCarsError = (state: { cars: CarState }) => state.cars.error;
