import {configureStore} from "@reduxjs/toolkit"
import playlistReducer from "@/store/playlistSlice";
import { localStorageMiddleware } from "./localStorageMiddleware";


const store = configureStore({
    reducer: {
        playlist: playlistReducer,
    },
    middleware: (getDefaultMiddleWare) => 
        getDefaultMiddleWare().concat(localStorageMiddleware),
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;