import { GridColDef } from '@mui/x-data-grid';

export const baseColumns: GridColDef[] = [
    { field: "billNumber", headerName: "Bill No", flex: 1,  width: 200 },
    {
        field: 'billType',
        headerName: 'Type',
        width: 200,
        flex: 2
    },
    {
        field: 'billStatus',
        headerName: 'Status',
        width: 200,
        flex: 2
    },
    {
        field: 'billSponsors',
        headerName: 'Sponsors', 
        width: 500,
        flex: 10,
    }
];