import { useCallback, useEffect, useState, useRef, RefObject } from "react";
import isEqual from "lodash.isequal";
import axios from "axios";
import "../App.css";
import { ClientResponse } from "../shared/types";
import { SupportedQueryParams, CancellableRequestReturnType } from "../api-client/Types";
import { useQueryParams } from ".";
import { saveTabsState } from '../appStore/slices/tabsState';
import { useAppDispatch } from '../appStore/hooks';
import {
  result, reload
} from '../appStore/slices/dataState';

interface DataProviderParams {
    dataFn:  (params?: SupportedQueryParams) => CancellableRequestReturnType;
    listRef: RefObject<any>;
}

interface DaraProviderReturn {
    queryParamsDataGridMixin: any;  // TODO: type
}

export const useDataProvider = (params: DataProviderParams): DaraProviderReturn => {

    const queryParamsRef = useRef<SupportedQueryParams | undefined>(undefined);

	const [ currentListRequest, setCurrentListRequest ] = useState<CancellableRequestReturnType | undefined>(undefined);
    const { dataGridMixin, queryParams} = useQueryParams(params.listRef);
    const appDispatch = useAppDispatch();
 
	const loadList = useCallback( async (qParams: SupportedQueryParams) => {
		appDispatch(reload());
		try {
			const ongoingRequest = params.dataFn(qParams);
			setCurrentListRequest(ongoingRequest);
			const data: ClientResponse = (await ongoingRequest.promise).data;
			appDispatch(result({
				items: data.items,
				itemsCount: data.count,
				error: undefined
			}));
		} catch(e: any) {
            if (!axios.isCancel(e)) {
                const errorMessage = e?.message ?? "Unexpected Error while getting legislations.";
                appDispatch(result({error: errorMessage}));
            }
		}
	}, [ appDispatch, setCurrentListRequest, params]);
	
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
        queryParamsDataGridMixin: dataGridMixin
    }
}

export default useDataProvider;