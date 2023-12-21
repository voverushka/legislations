import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../appStore/store';
import { SupportedQueryParams} from "../../api-client/Types";

type TabsState = Record<string, SupportedQueryParams>;
type TabStateAction = {
  tabId: string,
  settings: SupportedQueryParams
}

export interface GlobalState {
  filteringEnabled: boolean;
  infoMessage: string | undefined;
  tabsState: TabsState;
}

const initialState: GlobalState = {
  filteringEnabled: false,
  infoMessage: undefined,
  tabsState: {}
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
    },
    saveTabsState: (state, action: PayloadAction<TabStateAction>) => {
      const { tabId, settings } = action.payload;
        state.tabsState[tabId] = settings;
    }
  },
});

export const { enableFiltering, disableFiltering, setInfo, saveTabsState} = globalState.actions;
export const filterOnSelector = (state: RootState) => state.globalState.filteringEnabled;
export const infoMessageSelector = (state: RootState) => state.globalState.infoMessage;
export const tabsStateSelector = (state: RootState) => state.globalState.tabsState;

export default globalState.reducer;
