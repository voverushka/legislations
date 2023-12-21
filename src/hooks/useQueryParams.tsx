import { useState, useCallback } from "react";
import { Types as servicesTypes} from "../api-client";
import { GridFilterModel, GridFeatureMode, GridPaginationModel } from '@mui/x-data-grid';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50];

const initialQuery = { 
    skip: 0,
    limit: DEFAULT_PAGE_SIZE
}

const filterDebounceMs = 500;

export const useQueryParams = () => {

    const [ queryParams, setQueryParams] = useState<servicesTypes.SupportedQueryParams>(initialQuery);

    const onFilterChange = useCallback((filterModel: GridFilterModel) => {
		const currentFilterStr = filterModel.items?.[0]?.value;
		if (currentFilterStr !== undefined) {
			setQueryParams({
		        ...queryParams, 
				bill_type: currentFilterStr, // we filter only by bill type now
                skip: 0 // once filter changes, pagination goes back to start
			});
		}
    }, [ setQueryParams, queryParams]);

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