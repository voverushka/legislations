import { combineReducers } from 'redux';

import globalReducer from './slices/globalState';
import tabsReducer from './slices/tabsState';

const rootReducer = combineReducers({
  global: globalReducer,
  tabs: tabsReducer
});

export default rootReducer;

