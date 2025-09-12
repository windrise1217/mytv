import type { DefaultStorageOptions } from '$types/storage';

export interface Token {
	tcd: string;
	token: string;
	timestamp?: number;
}

export interface Offer {
	tcds: Token[];
}

export interface StoreTokensResult extends DefaultStorageOptions {
	tailscaleTokens?: Token[];
}
