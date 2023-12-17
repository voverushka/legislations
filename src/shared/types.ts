export interface BillItem {
    id: number,
    billNumber: string;
    billType: string;
    billStatus: string;
    billSponsors: string;
    titleEn: string,
    titleGa: string;
    isFavourite?: boolean;
}

export type SelectedRow = Pick<BillItem, "billNumber" | "titleEn" | "titleGa">;