import { useCallback, useEffect, useState, useRef, useReducer, RefObject } from "react";
import isEqual from "lodash.isequal";
import axios from "axios";
import "../App.css";
import { ClientResponse, LegislationActionTypeEnum, LegislationListState, LegislationListAction, Reducer } from "../shared/types";
import { SupportedQueryParams, CancellableRequestReturnType } from "../api-client/Types";
import { initialLegislationsListState } from "../shared/Presets";
import { useQueryParams } from ".";
import { legislationsListReducer } from "../shared/legislationsListReducer";
import { useAppDispatch } from '../appStore/hooks';
import {
  saveTabsState
} from '../appStore/global/globalState';

interface DataProviderParams {
    dataFn:  (params?: SupportedQueryParams) => CancellableRequestReturnType;
    listRef: RefObject<any>;
}

interface DaraProviderReturn {
    listState: LegislationListState;
    queryParamsDataGridMixin: any;  // TODO: type
    onExternalListStateChange: (newState: LegislationListState) => void;
}

export const useDataProvider = (params: DataProviderParams): DaraProviderReturn => {

    const queryParamsRef = useRef<SupportedQueryParams | undefined>(undefined);
    const [ listState, dispatch] = useReducer<Reducer<LegislationListState, LegislationListAction>, LegislationListState>(
		legislationsListReducer, initialLegislationsListState, () => initialLegislationsListState);

	const [ currentListRequest, setCurrentListRequest ] = useState<CancellableRequestReturnType | undefined>(undefined);
    const { dataGridMixin, queryParams} = useQueryParams(params.listRef);
    const appDispatch = useAppDispatch();
 	
	// functions
    const onExternalListStateChange = useCallback((newState: LegislationListState) => {
        // we might choose to refresh list instead
        dispatch({type: LegislationActionTypeEnum.general, payload: newState})
    }, [ dispatch]);

	const loadList = useCallback( async (qParams: SupportedQueryParams) => {
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
            if (!axios.isCancel(e)) {
                const errorMessage = e?.message ?? "Unexpected Error while getting legislations.";
                dispatch({type: LegislationActionTypeEnum.result, payload: { error: errorMessage}});
            }
		}
	}, [ dispatch, setCurrentListRequest, params]);
	
    useEffect(() => {
       return  () => {
            if (!currentListRequest?.isFullfilled) {
                currentListRequest?.cancel();
            }
        }
    }, [currentListRequest ]);

	useEffect(() => {
      	if (!isEqual(queryParamsRef.current, queryParams)) {
         	queryParamsRef.current = {...queryParams};
			if (!currentListRequest?.isFullfilled) {
				currentListRequest?.cancel();
			}
            appDispatch(saveTabsState({ // save query in global state
                settings: queryParams
            }));
			loadList(queryParams);
   	    }
	}, [ queryParams, currentListRequest, loadList, appDispatch]); 

    return {
        listState,
        queryParamsDataGridMixin: dataGridMixin,
        onExternalListStateChange
    }
}

export default useDataProvider;