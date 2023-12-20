export interface BillItem {
    id: string,
    billNumber: string;
    billType: string;
    billStatus: string;
    billSponsors: string;
    titleEn: string,
    titleGa: string;
    isFavourite: boolean;
}

export interface ClientResponse {
    count: number,
    items: BillItem[]
}

export type SelectedRow = Pick<BillItem, "billNumber" | "titleEn" | "titleGa">;

export type onFavouriteChangeCallbackType = (billNo: string, isFavourite: boolean) => void;