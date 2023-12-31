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

export enum LegislationActionTypeEnum {
    reload="reload",
    result="result",
    external="external"
}

export interface LegislationListState {
    loading?: boolean;
    items?: BillItem[],
    itemsCount?: number;
    error?: string | undefined;
}

export interface LegislationListAction {
    type: LegislationActionTypeEnum;
    payload?: LegislationListState;
}

export type Reducer<S, A> = (prevState: S, action: A) => S;