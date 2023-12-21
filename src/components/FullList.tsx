import React, { useCallback } from "react";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import "../App.css";
import { LegislationActionTypeEnum } from "../shared/types";
import { useFavouritesColumn } from "../hooks/useFavouritesColumn";
import { DataGridStyles } from "../shared/Presets";
import { useRowClickHandler, useDataProvider, useBaseColumns } from "../hooks";
import { LegislationsService } from "../api-client";
import Error from "../components/Error";


function FullList() {

	const { items, 
		itemsCount, 
		error, loading, dispatch,
		 queryParamsDataGridMixin} = useDataProvider( {
			dataFn: LegislationsService.getLegislations,
			tabId: "all-bills"
		 });
	
    const onFavouriteChange = useCallback((billId: string, favouriteStatus: boolean) => {
        const changedBillIndex = (items ?? []).findIndex(bl => bl.id === billId);
        if (changedBillIndex >= 0 && items) {
            items[changedBillIndex].isFavourite = favouriteStatus;
            dispatch({ type: LegislationActionTypeEnum.general, payload: {
				items: [...items]
			}})
        }
    }, [items, dispatch]);

	// hooks
	const { rowHandlerDataGridMixin, RowInfo} = useRowClickHandler();
	const favouritesColumn = useFavouritesColumn(onFavouriteChange);
	const baseColumns = useBaseColumns();
	
	// JSX
	return (
		<>
			<Box className="App">
				{ error && <Error message={error} />}
				<DataGrid
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