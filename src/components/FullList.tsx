import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import "../App.css";
import { DataGrid, GridFilterModel, GridRowParams, GridPaginationModel } from '@mui/x-data-grid';
import LegislationsService  from "../../src/services/Legislation";
import { deserialiseBills } from "../shared/util";
import { BillItem, SelectedRow } from "../shared/types";
import Box from '@mui/material/Box';
import SimpleDialog from "../components/Dialog";
import { useColumns } from "../hooks/useColumns";
import { Types as servicesTypes} from "../services";
import { DEFAULT_PAGE_SIZE, initialQuery } from "../shared/Presets";
import isEqual from "lodash.isequal";
import { LegislationQueryParams } from "../services/Types";
import { CancellableRequestReturnType, CancellableRequestType } from "../services/Types";
import CancellableRequest  from "../services/CancellableRequest";

function FullList() {

	const queryParamsRef = useRef<LegislationQueryParams | undefined>(undefined);

	// state
	
	const [ queryParams, setQueryParams] = useState<servicesTypes.LegislationQueryParams>(initialQuery);
	const [ currentListRequest, setCurrentListRequest ] = useState<CancellableRequestReturnType | undefined>(undefined);
	
	const [ items, setItems ] = useState<BillItem[]>([]);
    const [ itemsCount, setItemsCount ] = useState<number>(0);
	const [ isLoading, setLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | undefined>(undefined);
	const [ selectedRow, setSelectedRow ] = useState<SelectedRow | undefined>(undefined);

	const loadList = useCallback( async (qParams: LegislationQueryParams) => {
		setLoading(true);
		try {
			const r = CancellableRequest(qParams);
			setCurrentListRequest(r);
			const data: any = (await r.promise).data;
			setItemsCount(data.head.counts.billCount);
			setItems(deserialiseBills(data.results));
		} catch(e: any) {
			setError(e?.message ?? "Unexpected Error while getting legislations.")
		} finally {
			setLoading(false);
		}
	}, [setLoading,  setError,  setItemsCount, setItems, currentListRequest ]);
	
    const onFavouriteChange = useCallback((billNumber: string, favouriteStatus: boolean) => {
        const changedBillIndex = items.findIndex(bl => bl.billNumber === billNumber);
        if (changedBillIndex >= 0) {
            items[changedBillIndex].isFavourite = favouriteStatus;
            setItems([...items]);
        }
    }, [items, setItems]);

	useEffect(() => {
		if (!isEqual(queryParamsRef.current, queryParams)) {
			queryParamsRef.current = queryParams;
			if (!currentListRequest?.isFullfilled) {
				currentListRequest?.cancel();
			}
			loadList(queryParams);
		}
	}, [ queryParams, currentListRequest , setCurrentListRequest, loadList ]);

	// hooks
	const columns = useColumns( onFavouriteChange);

    const onFilterChange = useCallback((filterModel: GridFilterModel) => {
		const currentFilter = filterModel.items?.[0]?.value;
		if (currentFilter !== undefined) {
			setQueryParams({
				...queryParams,
				bill_status: [ currentFilter ]
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
					pageSizeOptions={[10, 25, 50]}
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