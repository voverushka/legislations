import React, { useCallback, useState } from "react";
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

import { LegislationsService } from "../services";

export const useColumns = (): GridColDef[] => {

    const [ favourites, setFavourites ] = useState<string[]>([]); // get favourites from servers to populate it
    const [ inTransition, setInTransition ] = useState<string[]>([]);

	const toggleFavourite = useCallback((billNumber: string) => { // TODO: bind it
		if (favourites.includes(billNumber)) {
			const fvIndex = favourites.indexOf(billNumber);
			if (fvIndex >= 0) {
                setInTransition([...inTransition, billNumber]);
                LegislationsService.setIsFavourite(billNumber, false).then(r => {
                    setFavourites([...r.favourites]);
                }).finally(() => {
                    inTransition.splice(inTransition.indexOf(billNumber), 1);
                    setInTransition([...inTransition]);
                });
			}
		} else {
            setInTransition([...inTransition, billNumber]);
            LegislationsService.setIsFavourite(billNumber, true).then(r => {
                setFavourites([...r.favourites]);
            }).finally(() => {
                inTransition.splice(inTransition.indexOf(billNumber), 1);
                setInTransition([...inTransition]);
            });
		}
	}, [inTransition, favourites, setInTransition, setFavourites]);

    return [
        {
        field: "isFavourite", 
        headerName: "Favorite", 
        flex: 1, 
        type: "actions", 
        getActions: (params: GridRowParams) => {
            const billNo = params.row.billNumber;
            const isInFavourites = favourites.includes(billNo) ;
            const isInTransition = inTransition.includes(billNo);
           
            return [ // TODO: do tooltip
                    <Tooltip title={isInFavourites ? "Unfavourite" : "Make favourite"}>
                        <IconButton  
                            disabled={isInTransition}
                            onClick={() => toggleFavourite(billNo)}>
                            <CircularProgress
                                    size={isInTransition? 30: 0}
                                    sx={{
                                    color: isInFavourites ? "gray": "green",
                                    position: 'absolute',
                                    zIndex: 1,
                                }}
                            />
                            <StarIcon color={isInFavourites ? "success": "action"}/>
                        </IconButton>
                    </Tooltip>
                ]
        }},
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
  ]
}