import React, { useCallback, useState } from "react";
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { baseColumns } from "../shared/Presets";

import { LegislationsService } from "../services";
import { BillItem, onFavouriteChangeCallbackType } from "../shared/types";

export const useColumns = ( onFavouriteChangeCallback:  onFavouriteChangeCallbackType): GridColDef[] => {

    const [ inTransition, setInTransition ] = useState<string[]>([]);

	const toggleFavourite = useCallback((bill: BillItem) => { // TODO: bind it
  		LegislationsService.setIsFavourite(bill.billNumber, !bill.isFavourite).then(r => {
            onFavouriteChangeCallback(bill.billNumber, !bill.isFavourite);
        });
	}, [ onFavouriteChangeCallback ]);

    return [
        {
            field: "isFavourite", 
            headerName: "Favorite", 
            flex: 1, 
            type: "actions", 
            getActions: (params: GridRowParams) => {
            const billNo = params.row.billNumber;
            const isInTransition = inTransition.includes(billNo);

            const bill = params.row;
           
            return [ 
                <Tooltip title={ bill.isFavourite? "Unfavourite" : "Make favourite"}>
                    <IconButton  
                        disabled={isInTransition}
                        onClick={() => {
                            if (!inTransition.includes(bill.billNumber)) {
                                toggleFavourite(bill);
                            }
                        }}>
                        <CircularProgress
                                size={isInTransition? 30: 0}
                                sx={{
                                color: bill.isFavourite ? "gray": "green",
                                position: 'absolute',
                                zIndex: 1,
                            }}
                        />
                        <StarIcon color={bill.isFavourite ? "success": "action"}/>
                    </IconButton>
                </Tooltip>
            ]
        }
    },
    ...baseColumns
  ]
}