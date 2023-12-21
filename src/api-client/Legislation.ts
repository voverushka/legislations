import type { LegislationQueryParams } from "./Types";
import CancellableRequest from "./CancellableRequest";
import { CancellableRequestReturnType } from "./Types";
import axios from "axios";

// TODO: maybe to have interceptor which adds base url and
// handles ignores cancellation error

interface FavouriteResponse {
    billNo: string;
    isFavourite: boolean;  // could we set undefined here to indicate transition ?
}

const LegislationsService = {
	getLegislations: (params?: LegislationQueryParams): CancellableRequestReturnType => {
        return CancellableRequest("/legislation", params ?? {});
    },

    changeFavouriteStatus: (billId: string, isFavourite: boolean): Promise<FavouriteResponse> => {
        return axios.get("/favourite", { // TODO: should be post
            params: {
                billId,
                isFavourite
            }
        }).then((r: any) =>  r.data);
    },

    getFavourites: (params?: LegislationQueryParams): CancellableRequestReturnType => {
        return CancellableRequest("/favourites", params ?? {});
    },

    prefetch: () => axios.post("/prefetch")
};

export default LegislationsService;