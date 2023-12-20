// TODO: types generation using OpenAPI
export interface LegislationQueryParams {
	bill_status?: Array<string>;
	bill_source?: Array<string>;
	date_start?: string;
	date_end?: string;
	skip?: number;
	limit?: number;
	member_id?: string;
	bill_id?: string;
	bill_no?: string;
	bill_year?: string;
	chamber_id?: string;
	act_year?: string;
	act_no?: string;
	lang?: string;
	// not supported by server yet
	bill_type?: string;
}

export interface CancellableRequestReturnType {
	promise: Promise<any>;
	cancel: () => void;
	isFullfilled: boolean;
}

export type CancellableRequestType = (params: any) => CancellableRequestReturnType;

