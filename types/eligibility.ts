export interface Eligibility {
	eligible: boolean;
	reason: string;
	id?: string;
	checkedAt?: number;
	error?: string;
	offerType?: string;
}

export interface EligibilityApiResponse {
	error?: string;
	data?: {
		offerType?: string;
		tcds?: Array<{ tcd: string; token: string }>;
	};
}
