import React, { useEffect, useState } from "react";
import "../App.css";
import { DataGrid, MuiEvent, GridRowParams, GridCallbackDetails } from '@mui/x-data-grid';
import LegislationsService  from "../../src/services/Legislation";
import { deserialiseBills } from "../shared/util";
import { BillItem, SelectedRow } from "../shared/types";
import Box from '@mui/material/Box';
import SimpleDialog from "../components/Dialog";
import { baseColumns } from "../shared/Presets";

function FavouritesList() {

	// state
	const [ items, setItems ] = useState<BillItem[]>([]);
	const [ isLoading, setLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | undefined>(undefined);
	const [ selectedRow, setSelectedRow ] = useState<SelectedRow | undefined>(undefined);


	// hooks
	
	useEffect(() => {
		async function load() {
			try {
				const data: any = await LegislationsService.getFavouriteLegislations();
				setItems(deserialiseBills(data.results));
			} catch(e: any) {
				setError(e?.message ?? "Unexpected Error while getting legislations.")
			} finally {
				setLoading(false);
			}
		}
		setLoading(true);
		load();
	}, []);

	return (
		<>
			<Box className="App"
				sx={{
					width: "80vw",
					height: "80vh",
				}}
			>
				<DataGrid
					sx={{
						"& .MuiDataGrid-columnHeaders": {
							background: "#e9e9ea"
						}
					}}
					columns={baseColumns}
                    filterMode="client"
                    onFilterModelChange={() => {
                        console.log("Filter changed");
                    }}
                    paginationMode="client"
                    onPaginationModelChange={() => {
                        console.log("Pagination happens");
                    }}
					rows={items}
					loading={isLoading}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                    }}
					onRowClick={(params: GridRowParams) => {
						const { billNumber, titleEn, titleGa} = params.row;
						setSelectedRow({
							billNumber, titleEn, titleGa
						});
					}}
				/>
			</Box>
            { selectedRow && <SimpleDialog
					open={true}
					selectedRow={selectedRow}
					onClose={() => {
						setSelectedRow(undefined);
					}}
			 />}
		</>
	);
}

export default FavouritesList;