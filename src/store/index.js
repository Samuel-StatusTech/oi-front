import { createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import reducers from '../reducers';

import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);