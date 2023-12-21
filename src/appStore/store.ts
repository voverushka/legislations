import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import globalState from './global/globalState';

export const store = configureStore({
  reducer: {
    globalState
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
