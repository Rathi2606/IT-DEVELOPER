import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedLocation: "", 
  sortByPrice: "", 
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setSortByPrice: (state, action) => {
      state.sortByPrice = action.payload;
    },
    clearFilters: (state) => {
      state.selectedLocation = "";
      state.sortByPrice = "";
    },
  },
});

export const { setLocation, setSortByPrice, clearFilters } = filterSlice.actions;

export default filterSlice.reducer;