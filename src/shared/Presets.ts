import { GridColDef } from '@mui/x-data-grid';

export const baseColumns: GridColDef[] = [
    { field: "billNumber", 
        headerName: "Bill No", 
        filterable: false,
        sortable: false,
        flex: 1,  
        width: 200 
    },
    {
        field: 'billType',
        headerName: 'Type',
        filterable: false,
        sortable: false,
        width: 200,
        flex: 2
    },
    {
        field: 'billStatus',
        headerName: 'Status',
        sortable: false,
        width: 200,
        flex: 2
    },
    {
        field: 'billSponsors',
        headerName: 'Sponsors', 
        filterable: false,
        sortable: false,
        width: 500,
        flex: 10,
    }
];

export const fieldNameFilterMap = {
    billStatus: "bill_status"
}

export const DEFAULT_PAGE_SIZE = 25;

export const initialQuery = { 
    skip: 0,
    limit: DEFAULT_PAGE_SIZE
}