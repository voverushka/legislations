import { combineReducers } from 'redux';

import globalReducer from './slices/globalState';
import tabsReducer from './slices/tabsState';
import dataReducer from './slices/dataState';

const rootReducer = combineReducers({
  global: globalReducer,
  tabs: tabsReducer,
  data: dataReducer
});

export default rootReducer;