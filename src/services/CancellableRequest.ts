import axios from "axios";
import { CancellableRequestReturnType } from "./Types";

const CancellableRequest = (requestParams: any): CancellableRequestReturnType => {
    const controller = new AbortController();

    let fullfilled: boolean = false;

    const p = {
        url: "/legislation",
        signal: controller.signal,
        params: requestParams
    }
    const req = axios(p).catch((e) => {
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