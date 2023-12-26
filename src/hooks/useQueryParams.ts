import { useState, useCallback, RefObject , useRef} from "react";
import { Types as servicesTypes} from "../api-client";
import { GridFilterModel, GridFeatureMode, GridPaginationModel} from '@mui/x-data-grid';
import { useAppSelector } from '../appStore/hooks';
import {
    activeTabState
  } from '../appStore/global/globalState';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50];

const defaultInitialQuery = { 
    skip: 0,
    limit: DEFAULT_PAGE_SIZE
}

const filterDebounceMs = 500;

export const useQueryParams = (listRef: RefObject<any>) => {

    const prevFilter = useRef<string | undefined>(undefined);
    const initialQuery = useAppSelector(activeTabState) ?? defaultInitialQuery;

    const [ queryParams, setQueryParams] = useState<servicesTypes.SupportedQueryParams>(initialQuery);

    const onFilterChange = useCallback((filterModel: GridFilterModel) => {
		const currentFilterStr = filterModel.items?.[0]?.value;
		if (currentFilterStr !== undefined && prevFilter.current !== currentFilterStr) {
			setQueryParams({
		        ...queryParams, 
				bill_type: currentFilterStr, // we filter only by bill type now
                skip: 0 // once filter changes, pagination goes back to start
			});
            prevFilter.current = currentFilterStr;
            listRef.current?.setPage(0);
		}
    }, [ setQueryParams, queryParams, listRef]);

    const onPaginationChage = useCallback((paginationModel: GridPaginationModel) => {
        setQueryParams({
			...queryParams,
			skip: paginationModel.page * paginationModel.pageSize,
			limit: paginationModel.pageSize
		});
    }, [ setQueryParams, queryParams ]);

    return {
        dataGridMixin: {
            filterMode: "server" as GridFeatureMode,
            paginationMode: "server" as GridFeatureMode,
            onFilterModelChange: onFilterChange,
            onPaginationModelChange: onPaginationChage,
            initialState:{
                pagination: { paginationModel: { pageSize: DEFAULT_PAGE_SIZE } },
            },
            pageSizeOptions: PAGE_SIZE_OPTIONS
        },
        initialQuery,
        filterDebounceMs,
        queryParams
    }
}

export default useQueryParams;