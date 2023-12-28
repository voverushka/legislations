import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { BillItem } from '../../shared/types';

interface DataState {
  loading?: boolean;
  items?: BillItem[],
  itemsCount?: number;
  error?: string | undefined;
}

interface UpdateFavouritePayload {
  itemId: string;
  favouriteStatus: boolean;
}

type ResultPayload = Pick<DataState, "items" | "itemsCount" | "error">;

const initialState: DataState = {
	loading: false,
	items: [],
	error: undefined,
	itemsCount: 0
}

export const listState = createSlice({
  name: 'list',
  initialState,
  reducers: {
    reload: (state) => {
      state.loading = true;
      state.error = undefined;
    },
    result: (state, action: PayloadAction<ResultPayload>) => {
      const { error, items, itemsCount } = action.payload;
      state.loading = false;
      if (action.payload.error !== undefined) {
        // failure
        state.error = error;
      } else {
        state.error = undefined;
        state.items = items;
        state.itemsCount = itemsCount;
      }
    },
    updateFavourite: (state, action: PayloadAction<UpdateFavouritePayload>) => {
      const changedBillIndex = (state.items ?? []).findIndex(bl => bl.id === action.payload.itemId);
      if (changedBillIndex >= 0 && state.items) {
        state.items[changedBillIndex].isFavourite = action.payload.favouriteStatus;
      }
    }
  },
});

export const { result, reload, updateFavourite } = listState.actions;
export const currentDataSelector = (state: RootState) => state.data;

export default listState.reducer;