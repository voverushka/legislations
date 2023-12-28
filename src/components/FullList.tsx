import React from "react";
import Box from '@mui/material/Box';
import { DataGrid , useGridApiRef} from '@mui/x-data-grid';
import "../App.css";
import { useFavouritesColumn } from "../hooks/useFavouritesColumn";
import { DataGridStyles } from "../shared/Styles";
import { useRowClickHandler, useDataProvider, useBaseColumns } from "../hooks";
import { LegislationsService } from "../api-client";
import Error from "../components/Error";
import { useAppSelector } from '../appStore/hooks';
import {
	currentDataSelector
} from '../appStore/slices/dataState';


function FullList() {
	const allListRef = useGridApiRef();
	// hooks
	const { queryParamsDataGridMixin} = useDataProvider( {
		dataFn: LegislationsService.getLegislations,
		listRef: allListRef
	 });
	
	const { items, itemsCount, loading, error } = useAppSelector(currentDataSelector);
	const { rowHandlerDataGridMixin, RowInfo } = useRowClickHandler();
	const baseColumns = useBaseColumns(true);

	const favouritesColumn = useFavouritesColumn();
	
	// JSX
	return (
		<>
			<Box className="App">
				{ error && <Error message={error} />}
				<DataGrid
					apiRef={allListRef}
					sx={DataGridStyles}
					columns={[
						favouritesColumn,
						...baseColumns
					]}
                    rowCount={itemsCount}
					rows={items ?? []}
					loading={loading}
			   		{...queryParamsDataGridMixin }
					{...rowHandlerDataGridMixin}
          		/>
			</Box>
            { RowInfo }
		</>
	);
}

export default FullList;