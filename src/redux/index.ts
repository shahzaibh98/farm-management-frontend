import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import tokenRefreshMiddleware from './middleware/tokenRefreshMiddleware';
import rootReducer from './reducers/index';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(thunk, tokenRefreshMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
