import { GridColDef } from '@mui/x-data-grid';
import { LegislationListState } from './types';

//TODO: could be moved to styles
export const DataGridStyles = {
    "& .MuiDataGrid-columnHeaders": {
        background: "#e9e9ea"
    },
    "& .MuiDataGrid-cell: focus, & .MuiDataGrid-cell: focus-within": {
        outline: "none"
    },
    "& .MuiDataGrid-columnHeader focus, & .MuiDataGrid-columnHeader: focus-within": {
        outline: "none"
    },
    "width": "80vw",
	"height": "70vh"
};

export const initialLegislationsListState: LegislationListState = {
	loading: false,
	items: [],
	error: undefined,
	itemsCount: 0
}