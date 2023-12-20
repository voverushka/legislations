import React, { useCallback, useEffect, useState, useRef, useReducer } from "react";
import isEqual from "lodash.isequal";
import "../App.css";
import { ClientResponse, LegislationActionTypeEnum, LegislationListState, LegislationListAction, Reducer } from "../shared/types";
import { LegislationQueryParams, CancellableRequestReturnType } from "../api-client/Types";
import { initialLegislationsListState } from "../shared/Presets";
import { useQueryParams } from "../hooks";
import { legislationsListReducer } from "../shared/legislationsListReducer";

interface DataProviderParams {
    dataFn:  (params?: LegislationQueryParams) => CancellableRequestReturnType
}
export const useDataProvider = (params: DataProviderParams) => {

    const queryParamsRef = useRef<LegislationQueryParams | undefined>(undefined);
    const [ listState, dispatch] = useReducer<Reducer<LegislationListState, LegislationListAction>, LegislationListState>(
		legislationsListReducer, initialLegislationsListState, () => initialLegislationsListState);

	const [ currentListRequest, setCurrentListRequest ] = useState<CancellableRequestReturnType | undefined>(undefined);
    const { dataGridMixin, queryParams} = useQueryParams();
	const {  items, itemsCount, loading,  error } = listState;
	
	// functions
	const loadList = useCallback( async (qParams: LegislationQueryParams) => {
		dispatch({ type: LegislationActionTypeEnum.reload })
		try {
			const ongoingRequest = params.dataFn(qParams);
			setCurrentListRequest(ongoingRequest);
			const data: ClientResponse = (await ongoingRequest.promise).data;
			dispatch({ type: LegislationActionTypeEnum.result, payload: {
				items: data.items,
				itemsCount: data.count,
				error: undefined
			}});
		} catch(e: any) {
			const errorMessage = e?.message ?? "Unexpected Error while getting legislations.";
			dispatch({type: LegislationActionTypeEnum.result, payload: { error: errorMessage}});
		}
	}, [ dispatch, setCurrentListRequest]);
	
   	// effects
	useEffect(() => {
		return () => {
			// cancel on unmount
			if (!currentListRequest?.isFullfilled) {
				currentListRequest?.cancel();
			}
		}
	}, [ currentListRequest ]);

	useEffect(() => {
		if (!isEqual(queryParamsRef.current, queryParams)) {
			queryParamsRef.current = queryParams;
			if (!currentListRequest?.isFullfilled) {
				currentListRequest?.cancel();
			}
			loadList(queryParams);
		}
	}, [ queryParams, currentListRequest, loadList ]); 

    return {
        items, 
        itemsCount, 
        loading,  
        error, 
        dispatch,
        queryParamsDataGridMixin: dataGridMixin
    }
}

export default useDataProvider;