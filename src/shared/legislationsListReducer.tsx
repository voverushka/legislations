import {  LegislationActionTypeEnum, LegislationListState, LegislationListAction } from "./types";
  
 export function legislationsListReducer(state: LegislationListState, action: LegislationListAction) {
    const { type, payload} = action;
    switch (type) {
      case LegislationActionTypeEnum.reload:
        return {
          ...state,
          loading: true,
          error: undefined
        };
      case LegislationActionTypeEnum.result:
        const { items, itemsCount, error } = payload ?? {};
        if (error !== undefined) {
            return {
                ...state,
                error,
                loading: false
                // ignore items
            }
        }
        return {
          ...state,
          loading: false,
          error: undefined,
          items,
          itemsCount
        };
        case LegislationActionTypeEnum.external: //could be default too
          return {
            ...state,
            ...action.payload
          }
      default:
        return state;
    }
  }