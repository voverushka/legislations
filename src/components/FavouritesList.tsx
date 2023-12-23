import React from "react";
import Box from '@mui/material/Box';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import "../App.css";
import { DataGridStyles } from "../shared/Presets";
import { useRowClickHandler, useDataProvider, useBaseColumns } from "../hooks";
import { LegislationsService } from "../api-client";
import Error from "../components/Error";

function FullList() {

	const favouristesListRef = useGridApiRef();

	const { listState, queryParamsDataGridMixin} = useDataProvider({
			dataFn: LegislationsService.getFavourites,
			listRef: favouristesListRef
		});
	
	const { items, itemsCount, loading, error } = listState;
	
	// hooks
	const { rowHandlerDataGridMixin, RowInfo} = useRowClickHandler();
	const baseColumns = useBaseColumns(false);
	
	// JSX
	return (
		<>
			<Box className="App">
				{ error && <Error message={error} />}
				<DataGrid
					apiRef={favouristesListRef}
					sx={DataGridStyles}
					columns={baseColumns}
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