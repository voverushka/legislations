import axios from "axios";
import { CancellableRequestReturnType } from "./Types";

const CancellableRequest = (url: string, requestParams: any): CancellableRequestReturnType => {
    const controller = new AbortController();

    let fullfilled: boolean = false;

    const p = {  
        signal: controller.signal,
        params: requestParams
    }
    const req = axios.get(url, p).finally(() => {
        fullfilled = true;
    });
            
    return {
        promise: req,
        cancel: () => {
            controller.abort();
        },
        isFullfilled: fullfilled
    }
};

export default CancellableRequest;