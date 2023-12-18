import { Types } from "../services";
import { BillItem } from "./types";

export const deserialiseBills = (data: any[]): BillItem[] => {
    const items = data.reduce<BillItem[]>((acc, currentBill, index) => {
        const current = currentBill.bill;
        acc.push({
            id: index, //`${index}-${current.billNo}`, 
            billNumber: current.billNo,
            billType: current.billType,
            billStatus: current.status,
            billSponsors: current.sponsors.reduce((sp: any[], currentSp: any) => {
                // TODO: should I display only primiary sponsor ?
                // can only one sponsor be primary, and what if none of sponsors are primary ?
                const sponsorName = currentSp.sponsor.as.showAs;
                if (sponsorName) {
                    sp.push(currentSp.sponsor.as.showAs);
                }
                return sp;
            }, []).join(", "),
            titleEn: current.shortTitleEn,
            titleGa: current.shortTitleGa,
            isFavourite: current.isFavourite
        })
        return acc;
    }, []);
    return items;
}