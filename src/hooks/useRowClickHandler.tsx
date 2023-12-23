import { useState, useCallback, useMemo } from "react";
import { SelectedRow } from "../shared/types";
import { GridRowParams } from '@mui/x-data-grid';
import SimpleDialog from "../components/Dialog";

export const useRowClickHandler = () => {
    const [ selectedRow, setSelectedRow ] = useState<SelectedRow | undefined>(undefined);

    const rowClickHandler = useCallback((params: GridRowParams) => {
        const { billNumber, titleEn, titleGa} = params.row;
        setSelectedRow({
            billNumber, titleEn, titleGa
        });
    }, [ setSelectedRow ])

    const RowInfo = useMemo(() => {
        if (!selectedRow) {
            return null;
        }
        return <SimpleDialog
            open={true}
            selectedRow={selectedRow}
            onClose={() => {
                setSelectedRow(undefined);
            }} />;

    }, [ selectedRow, setSelectedRow]);

    return {
        rowHandlerDataGridMixin: {
            onRowClick: rowClickHandler
        },
        RowInfo
    }

}

export default useRowClickHandler;