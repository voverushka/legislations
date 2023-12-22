import { LegislationListState } from './types';

//TODO: could be moved to styles
export const DataGridStyles = {
    "& .MuiDataGrid-columnHeaders": {
        background: "#f8f8f8"
    },
    "& .MuiDataGrid-cell: focus, & .MuiDataGrid-cell: focus-within": {
        outline: "none"
    },
    "& .MuiDataGrid-columnHeader focus, & .MuiDataGrid-columnHeader: focus-within": {
        outline: "none"
    },
    "width": "90vw",
	"height": "70vh"
};

export const initialLegislationsListState: LegislationListState = {
	loading: false,
	items: [],
	error: undefined,
	itemsCount: 0
}