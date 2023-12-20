import React, { useCallback, useEffect, useState, useRef, useReducer } from "react";
import isEqual from "lodash.isequal";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import "../App.css";
import LegislationsService  from "../../src/api-client/Legislation";
import { ClientResponse, LegislationActionTypeEnum, LegislationListState, LegislationListAction, Reducer } from "../shared/types";
import { LegislationQueryParams, CancellableRequestReturnType } from "../api-client/Types";
import { baseColumns, DataGridStyles, initialLegislationsListState } from "../shared/Presets";
import { useQueryParams, useRowClickHandler } from "../hooks";
import { legislationsListReducer } from "../shared/legislationsListReducer";
import Error from "../components/Error";

function FavouritesList () {

	const queryParamsRef = useRef<LegislationQueryParams | undefined>(undefined);

	const [ listState, dispatch] = useReducer<Reducer<LegislationListState, LegislationListAction>, LegislationListState>(
		legislationsListReducer, initialLegislationsListState, () => initialLegislationsListState);

	const [ currentListRequest, setCurrentListRequest ] = useState<CancellableRequestReturnType | undefined>(undefined);
	const {  items, itemsCount, loading,  error } = listState;
	
	// functions
	const loadList = useCallback( async (qParams: LegislationQueryParams) => {
		dispatch({ type: LegislationActionTypeEnum.reload })
		try {
			const ongoingRequest = LegislationsService.getFavourites(qParams);
			setCurrentListRequest(ongoingRequest);
			const data: ClientResponse = (await ongoingRequest.promise).data;
			dispatch({ type: LegislationActionTypeEnum.result, payload: {
				items: data.items,
				itemsCount: data.count,
				error: undefined
			}});
		} catch(e: any) {
			const errorMessage = e?.message ?? "Unexpected Error while getting favourite legislations.";
			dispatch({type: LegislationActionTypeEnum.result, payload: { error: errorMessage}});
		}
	}, [ dispatch, setCurrentListRequest]);
	
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
	}, [ queryParams, currentListRequest, loadList ]);

	// JSX
	return (
		<>
			<Box className="App">
				{ error && <Error message={error} />}
				<DataGrid
					sx={DataGridStyles}
					columns={baseColumns}
			        rowCount={itemsCount}
					rows={items ?? []}
					loading={loading}
			   		{...dataGridMixin }
					{...rowHandlerDataGridMixin}
          		/>
			</Box>
            { RowInfo }
		</>
	);
}

export default FavouritesList;