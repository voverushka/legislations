import React, { useCallback, useEffect, useState, useRef } from "react";
import isEqual from "lodash.isequal";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import "../App.css";
import LegislationsService  from "../../src/api-client/Legislation";
import { BillItem, ClientResponse } from "../shared/types";
import { LegislationQueryParams, CancellableRequestReturnType } from "../api-client/Types";
import { baseColumns, DataGridStyles } from "../shared/Presets";
import { useQueryParams, useRowClickHandler } from "../hooks";

function FavouritesList() {

	const queryParamsRef = useRef<LegislationQueryParams | undefined>(undefined);

	// TODO: use reducer
	const [ currentListRequest, setCurrentListRequest ] = useState<CancellableRequestReturnType | undefined>(undefined);
	const [ items, setItems ] = useState<BillItem[]>([]);
    const [ itemsCount, setItemsCount ] = useState<number>(0);
	const [ isLoading, setLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | undefined>(undefined);

	// functions
	const loadList = useCallback( async (qParams: LegislationQueryParams) => {
		setLoading(true);
		setError(undefined);
		try {
			const ongoingRequest = LegislationsService.getFavourites(qParams);
			setCurrentListRequest(ongoingRequest);
			const data: ClientResponse = (await ongoingRequest.promise).data;
			setItemsCount(data.count);
			setItems(data.items);
		} catch(e: any) {
			setError(e?.message ?? "Unexpected Error while getting legislations.")
		} finally {
			setLoading(false);
		}
	}, [setLoading,  setError,  setItemsCount, setItems ]);

	// hooks
	const { dataGridMixin, queryParams} = useQueryParams();
	const { rowHandlerDataGridMixin, RowInfo} = useRowClickHandler();

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
	}, [ queryParams, currentListRequest , setCurrentListRequest, loadList ]);

	// JSX
	return (
		<>
			<Box className="App">
				<DataGrid
					sx={DataGridStyles}
					columns={baseColumns}
                    rowCount={itemsCount}
					rows={items}
					loading={isLoading}
               		{...dataGridMixin }
					{...rowHandlerDataGridMixin}
          		/>
			</Box>
            { RowInfo }
		</>
	);
}

export default FavouritesList;