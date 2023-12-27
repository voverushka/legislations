import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface GlobalState {
  filteringEnabled: boolean;
  infoMessage: string | undefined;
}

const initialState: GlobalState = {
  filteringEnabled: false,
  infoMessage: undefined,
};

export const globalState = createSlice({
  name: 'global',
  initialState,
  reducers: {
    enableFiltering: (state) => {
      state.filteringEnabled = true;
    },
    disableFiltering: (state) => {
        state.filteringEnabled = false;
    },
    setInfo: (state, action: PayloadAction<string | undefined>) => {
      state.infoMessage = action.payload;
    }
  },
});

export const { enableFiltering, disableFiltering, setInfo} = globalState.actions;
export const filterOnSelector = (state: RootState) => state.globalState.filteringEnabled;
export const infoMessageSelector = (state: RootState) => state.globalState.infoMessage;

export default globalState.reducer;
