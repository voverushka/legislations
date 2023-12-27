import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import globalState from './slices/globalState';
import tabs from "./slices/tabsState";

export const store = configureStore({
  reducer: {
    globalState,
    tabs
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
