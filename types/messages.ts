// Message types for browser.runtime messages

export type RuntimeMessage<
	T extends Record<string, unknown> = Record<string, unknown>,
> = { action: string } & T;

export interface Message {
	action: string;
	[key: string]: unknown;
}
