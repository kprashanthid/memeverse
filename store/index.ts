import { combineReducers, configureStore } from "@reduxjs/toolkit";
import memeReducer from "./slices/memeSlice";
import userReducer from "./slices/userSlice";
import themeReducer from "./themeSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem() {
    return Promise.resolve();
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storageEngine =
  typeof window !== "undefined" ? storage : createNoopStorage();

const persistConfig = {
  key: "root",
  storage: storageEngine,
};

const rootReducer = combineReducers({
  memes: persistReducer(persistConfig, memeReducer),
  user: userReducer,
  theme: themeReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
