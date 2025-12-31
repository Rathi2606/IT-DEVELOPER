import { configureStore } from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";

import { api } from "./api";
import searchReducer from "./features/searchSlice";
import filterReducer from "./features/filterSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    search:searchReducer,
    filter:filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);
