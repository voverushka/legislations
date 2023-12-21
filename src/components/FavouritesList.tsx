import React from "react";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import "../App.css";
import { DataGridStyles } from "../shared/Presets";
import { useRowClickHandler, useDataProvider, useBaseColumns } from "../hooks";
import { LegislationsService } from "../api-client";
function FullList() {

	const { items, 
		itemsCount, error, 
		loading, 
		queryParamsDataGridMixin} = useDataProvider({
			dataFn: LegislationsService.getFavourites,
			tabId: `fav-bills`
		});
	
	// hooks
	const { rowHandlerDataGridMixin, RowInfo} = useRowClickHandler();
	const baseColumns = useBaseColumns();
	
	// JSX
	return (
		<>
			<Box className="App">
				{/* { error && <Error message={error} />} */}
				<DataGrid
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