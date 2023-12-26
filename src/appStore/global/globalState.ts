import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../appStore/store';
import { SupportedQueryParams} from "../../api-client/Types";

type TabsState = Record<string, SupportedQueryParams>;
type TabQueryAction = {
  settings: SupportedQueryParams
}

export interface GlobalState {
  filteringEnabled: boolean;
  infoMessage: string | undefined;
  tabsState: TabsState;
  activeTabNo: number;
}

const initialState: GlobalState = {
  filteringEnabled: false,
  infoMessage: undefined,
  tabsState: {},
  activeTabNo: 0
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
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTabNo = action.payload;
    },
    saveTabsState: (state, action: PayloadAction<TabQueryAction>) => {
      const { settings } = action.payload;
        state.tabsState[state.activeTabNo] = settings;
    }
  },
});

export const { enableFiltering, disableFiltering, setInfo, saveTabsState, setActiveTab} = globalState.actions;
export const filterOnSelector = (state: RootState) => state.globalState.filteringEnabled;
export const infoMessageSelector = (state: RootState) => state.globalState.infoMessage;
export const activeTabState = (state: RootState) => {
  const {activeTabNo,tabsState } = state.globalState;
  return tabsState[activeTabNo];
}
export const activeTabSelector = (state: RootState) => state.globalState.activeTabNo;

export default globalState.reducer;
