import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../appStore/store';
import { SupportedQueryParams} from "../../api-client/Types";

interface TabsState {
    activeQuery: Record<string, SupportedQueryParams>;
    activeTabNo: number;
}

type TabQueryAction = {
  settings: SupportedQueryParams
}

const initialState: TabsState = {
  activeQuery: {},
  activeTabNo: 0
};

export const tabsState = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTabNo = action.payload;
    },
    saveTabsState: (state, action: PayloadAction<TabQueryAction>) => {
      const { settings } = action.payload;
        state.activeQuery[state.activeTabNo] = settings;
    }
  },
});

export const { setActiveTab, saveTabsState } = tabsState.actions;

export const activeTabStateSelector = (state: RootState) => {
    const {activeTabNo, activeQuery } = state.tabs;
    return activeQuery[activeTabNo];
  }
export const activeTabSelector = (state: RootState) => state.tabs.activeTabNo;

export default tabsState.reducer;