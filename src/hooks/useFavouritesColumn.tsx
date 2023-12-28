import React, { useCallback, useState } from "react";
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

import { LegislationsService } from "../api-client";
import { BillItem, onFavouriteChangeCallbackType } from "../shared/types";

export const useFavouritesColumn = ( onFavouriteChangeCallback:  onFavouriteChangeCallbackType): GridColDef => {

    const [ inTransition, setInTransition ] = useState<string[]>([]);

	const toggleFavourite = useCallback((bill: BillItem) => { 
        setInTransition([...inTransition, bill.id]);
  		LegislationsService.changeFavouriteStatus(bill.id, !bill.isFavourite).then(resp => {
            onFavouriteChangeCallback(resp.billNo, resp.isFavourite);
            setInTransition(inTr => {
                const ind = inTr.indexOf(resp.billNo);
                if (ind >= 0) {
                    const newState = [...inTr];
                    newState.splice(ind, 1);
                    return newState;
                }
                return inTr;
            });        
        });
	}, [ onFavouriteChangeCallback, setInTransition, inTransition]);

    const favouritesColumn = {
        field: "isFavourite", 
        headerName: "Favourite", 
        flex: 1, 
        type: "actions", 
        getActions: (params: GridRowParams) => {
            const billId = params.row.id;
            const isInTransition = inTransition.includes(billId);
            const bill = params.row;
            return [ 
                <Tooltip title={ isInTransition? "Processing..." : bill.isFavourite ? "Unfavourite" : "Make favourite"}>
                    <IconButton  
                        onClick={() => {
                            if (!inTransition.includes(bill.id)) {
                                setInTransition([...inTransition, bill.id]);
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
    }

    return favouritesColumn;
}
export default useFavouritesColumn;