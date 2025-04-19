import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import authReducer from './slices/authSlice';
// import userReducer from './slices/userSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  // user: userReducer,
});
 

const persistConfig = {
    key: "root",  
    storage,     
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//     reducer:{
//         auth: persistedAuthReducer,
        
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//           serializableCheck: false,  
//         }),
// })

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);