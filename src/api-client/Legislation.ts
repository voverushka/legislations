import type { LegislationQueryParams } from "./Types";
import cloneDeep from "lodash.clonedeep";
import CancellableRequest from "./CancellableRequest";
import { CancellableRequestReturnType } from "./Types";
import axios from "axios";

// TODO: maybe to have interceptor which adds base url and
// handles ignores cancellation error

interface FavouriteResponse {
    billNo: string;
    isFavourite: boolean;  // could we set undefined here to indicate transition ?
}

const LegislationsServiceFake = {
	getLegislations: (params?: LegislationQueryParams): CancellableRequestReturnType => {
        return CancellableRequest("/legislation", params ?? {});
    },

    changeFavouriteStatus: (billId: string, isFavourite: boolean): Promise<FavouriteResponse> => {
        return axios.get("/favourite", { // TODO: should be post
            params: {
                billId,
                isFavourite
            }
        });
    },

    getFavourites: (params?: LegislationQueryParams): CancellableRequestReturnType => {
        return CancellableRequest("/favourites", params ?? {});
    }
};

export default LegislationsServiceFake;


// sequential calls. This one will be more precise if counts updates, but more slow
// in this API initial startIndex is 0, sp we do not need to add 1 for start indexes
// export const getAllInstanceGroupsSequence = async () => {
// 	const maxPageSize = 50; // go on max page size

// 	return LegislationsService.getLegislations({}).then(
// 		async (response: any) => {
// 			if (response.items.length >= response.count) {
// 				//should be == but just in case putting >
// 				return response; // we are OK, not a lot of instance groups
// 			}
// 			let additionaRespStart = response.items.length;
// 			let inError = false;

// 			while (!inError && additionaRespStart < response.count) {
// 				try {
// 					const data = await LegislationsService.getLegislations({
// 						limit: maxPageSize,
// 						skip: additionaRespStart,
// 					});
// 					additionaRespStart += maxPageSize; // we assumimg we got all what we wanted
// 					//response.count = data.count;
// 					// response.items = [...response.items, ...(data.items ?? [])];
// 				} catch (e) {
// 					inError = true; // prevent infinite looping in case of error
// 					throw e;
// 				}
// 			}
// 			return response;
// 		}
// 	);
// };
