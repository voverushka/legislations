import React, { useCallback, useEffect, useState } from "react";
import "../App.css";
import { DataGrid, GridFilterModel, GridRowParams, GridCallbackDetails, GridPaginationModel } from '@mui/x-data-grid';
import LegislationsService  from "../../src/services/Legislation";
import { deserialiseBills } from "../shared/util";
import { BillItem, SelectedRow } from "../shared/types";
import Box from '@mui/material/Box';
import SimpleDialog from "../components/Dialog";
import { useColumns } from "../hooks/useColumns";
import { Types as servicesTypes} from "../services";
import { DEFAULT_PAGE_SIZE } from "../shared/Presets";

function FullList() {

	async function load() {
		console.log("Loading ");
		try {
			const data: any = await LegislationsService.getLegislations(queryParams);
			setItemsCount(data.head.counts.billCount);
			setItems(deserialiseBills(data.results));
		} catch(e: any) {
			setError(e?.message ?? "Unexpected Error while getting legislations.")
		} finally {
			setLoading(false);
		}
	}
	
	// state
	const [ queryParams, setQueryParams] = useState<servicesTypes.LegislationQueryParams>({
		skip: 0,
		limit: DEFAULT_PAGE_SIZE
	});
	const [ items, setItems ] = useState<BillItem[]>([]);
    const [ itemsCount, setItemsCount ] = useState<number>(0);
	const [ isLoading, setLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | undefined>(undefined);
	const [ selectedRow, setSelectedRow ] = useState<SelectedRow | undefined>(undefined);

    const onFavouriteChange = useCallback((billNumber: string, favouriteStatus: boolean) => {
        const changedBillIndex = items.findIndex(bl => bl.billNumber === billNumber);
        if (changedBillIndex >= 0) {
            items[changedBillIndex].isFavourite = favouriteStatus;
            setItems([...items]);
        }
    }, [items, setItems]);

	useEffect(() => {
		// TODO: request cancellation here !!
		setLoading(true);
		load();
	}, [ queryParams ])

	// hooks
	const columns = useColumns( onFavouriteChange);

    const onFilterChange = useCallback((filterModel: GridFilterModel) => {
		const currentFilter = filterModel.items?.[0]?.value;
		if (currentFilter !== undefined) {
			setQueryParams({
				...queryParams,
				"bill_status": currentFilter
			});
		}
    }, []);

    const onPaginationChage = useCallback((paginationModel: GridPaginationModel) => {
        setQueryParams({
			...queryParams,
			skip: paginationModel.page * paginationModel.pageSize,
			limit: paginationModel.pageSize
		});
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
						},
						"& .MuiDataGrid-cell: focus, & .MuiDataGrid-cell: focus-within": {
							outline: "none"
						}
					}}
					columns={columns}
                    rowCount={itemsCount}
					rows={items}
					loading={isLoading}
                    initialState={{
                        pagination: { paginationModel: { pageSize: DEFAULT_PAGE_SIZE } },
                    }}
                    filterMode="server"
                    onFilterModelChange={onFilterChange}
                    paginationMode="server"
                    onPaginationModelChange={onPaginationChage}
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

export default FullList;