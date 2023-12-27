import { GridColDef, getGridStringOperators } from '@mui/x-data-grid';
import { useAppSelector } from '../appStore/hooks';
import {
  filterOnSelector
} from '../appStore/slices/globalState';

const stringOperators = getGridStringOperators().filter((op => ['contains'].includes(op.value)));

export const useBaseColumns = (enableFilter: boolean): GridColDef[] => {
    
    const filteringOn = useAppSelector(filterOnSelector);

    return [
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
                filterable: enableFilter === true && filteringOn,
                filterOperators: stringOperators,
                sortable: false,
                width: 200,
                flex: 2
            },
            {
                field: 'billStatus',
                headerName: 'Status',
                filterable: false,
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
        ]
    }