import axios from "axios";
import { CancellableRequestReturnType } from "./Types";

const CancellableRequest = (url: string, requestParams: any): CancellableRequestReturnType => {
    const controller = new AbortController();

    let fullfilled: boolean = false;

    console.log("Request params ", requestParams);

    const p = {  
        signal: controller.signal,
        params: requestParams
    }
    const req = axios.get(url, p).catch((e) => {
        if (!axios.isCancel(e)) {
            throw e;
        }
    }).finally(() => {
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