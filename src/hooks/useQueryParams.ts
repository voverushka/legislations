import { useState, useCallback, RefObject , useRef} from "react";
import { Types as servicesTypes} from "../api-client";
import { GridFilterModel, GridFeatureMode, GridPaginationModel } from '@mui/x-data-grid';
import { useAppSelector } from '../appStore/hooks';
import {
    activeTabStateSelector
  } from '../appStore/slices/tabsState';
import {
    filterOnSelector
} from '../appStore/slices/globalState';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50];

const defaultInitialQuery = { 
    skip: 0,
    limit: DEFAULT_PAGE_SIZE
}

const filterDebounceMs = 500;
const serverType = "server" as GridFeatureMode;

export const useQueryParams = (listRef: RefObject<any>) => {

    const prevFilter = useRef<string | undefined>(undefined);
    const initialQuery = useAppSelector(activeTabStateSelector) ?? defaultInitialQuery;
    const filteringOn = useAppSelector(filterOnSelector);

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
            setTimeout(() => {
                listRef.current?.setPage(0);
            }, 0);
		}
    }, [ setQueryParams, queryParams, listRef, prevFilter]);

    const onPaginationChage = useCallback((paginationModel: GridPaginationModel) => {
        setQueryParams({
			...queryParams,
			skip: paginationModel.page * paginationModel.pageSize,
			limit: paginationModel.pageSize
		});
    }, [ setQueryParams, queryParams ]);

    const pageSize = initialQuery.limit ?? DEFAULT_PAGE_SIZE;
    const skip = (initialQuery.skip ?? 0 ) / pageSize;

    return {
        dataGridMixin: {
            filterMode: serverType,
            paginationMode: serverType,
            filterDebounceMs,
            onFilterModelChange: onFilterChange,
            onPaginationModelChange: onPaginationChage,
            initialState:{
                pagination: { paginationModel: { pageSize, page: skip } },
                filter: filteringOn ? {
                    filterModel: {
                      items: [{ field: "billType", operator: 'contains', value: initialQuery.bill_type }],
                    },
                  }: undefined
            },
            pageSizeOptions: PAGE_SIZE_OPTIONS
        },
        queryParams
    }
}

export default useQueryParams;