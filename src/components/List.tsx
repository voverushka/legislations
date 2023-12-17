import React, { useEffect, useState } from "react";
import "../App.css";
import { DataGrid, MuiEvent, GridRowParams, GridCallbackDetails } from '@mui/x-data-grid';
import LegislationsService  from "../../src/services/Legislation";
import { deserialiseBills } from "../shared/util";
import { BillItem, SelectedRow } from "../shared/types";
import Box from '@mui/material/Box';
import SimpleDialog from "../components/Dialog";
import { useColumns } from "../hooks/useColumns";
import { Types as ServiceTypes } from "../services";


interface ListProps {
    ItemsService: (params?: ServiceTypes.LegislationQueryParams) =>  Promise<any>;
}


function List(props: ListProps) {

	// state
	const [ items, setItems ] = useState<BillItem[]>([]);
	const [ isLoading, setLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | undefined>(undefined);
	const [ selectedRow, setSelectedRow ] = useState<SelectedRow | undefined>(undefined);


	// hooks
	const columns = useColumns();
	
	useEffect(() => {
		async function load() {
			try {
				const data: any = await props.ItemsService();
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
					columns={columns}
					rows={items}
					loading={isLoading}
					onRowClick={(params: GridRowParams, event: MuiEvent, details: GridCallbackDetails ) => {
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

export default List;
