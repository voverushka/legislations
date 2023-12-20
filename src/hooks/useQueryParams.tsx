import { useState, useCallback } from "react";
import { Types as servicesTypes} from "../api-client";
import { DataGrid, GridFilterModel, GridFeatureMode, GridPaginationModel } from '@mui/x-data-grid';

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [10, 25, 50];

const initialQuery = { 
    skip: 0,
    limit: DEFAULT_PAGE_SIZE
}

export const useQueryParams = () => {

    const [ queryParams, setQueryParams] = useState<servicesTypes.LegislationQueryParams>(initialQuery);

    const onFilterChange = useCallback((filterModel: GridFilterModel) => {
		const currentFilterStr = filterModel.items?.[0]?.value;
		if (currentFilterStr !== undefined) {
			setQueryParams({
				// once filter changes, pagination goes back to default
				bill_type: currentFilterStr
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
        queryParams
    }
}

export default useQueryParams;