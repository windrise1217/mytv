import { tokenValidityInterval } from '$config';
import { log } from '$helpers/logging';
import { notifyNewTokens } from '$helpers/notifications';

import type { StoreTokensResult, Token } from '$types/tokens';

export const extractMatchingTokens = (
	tcds: Token[],
	tailnetNames: string[],
) => {
	return tcds
		.filter(({ tcd }) => {
			const tcdName = tcd.replace(/\.ts\.net$/, '');
			return tailnetNames.some((name) => {
				if (name.includes('-')) {
					// Combo: must match exactly
					return tcdName === name;
				}

				// Single word: match any part
				return tcdName.split('-').includes(name);
			});
		})
		.map(({ token }) => token);
};

export const storeTokens = async (tokens: string[]) => {
	try {
		const result: StoreTokensResult = await browser.storage.local.get([
			'tailscaleTokens',
			'useSystemPush',
			'useNtfyPush',
			'ntfyUrl',
			'ntfyTopic',
			'ntfyToken',
		]);

		const now = Date.now();
		const existingTokens = Array.isArray(result.tailscaleTokens)
			? result.tailscaleTokens
			: [];
		const validTokens = filterValidTokens(existingTokens, now);

		if (validTokens.length !== existingTokens.length) {
			try {
				await browser.storage.local.set({ tailscaleTokens: validTokens });
			} catch (err) {
				log(
					`Failed to update valid tokens in storage: ${err}`,
					'ERROR',
					'Tokens',
				);
			}
		}

		const newTokens = tokens.filter(
			(token) => !validTokens.some((t: Token) => t.token === token),
		);
		const updatedTokens = validTokens.concat(
			newTokens.map((token) => ({ token, timestamp: now }) as Token),
		);

		try {
			await browser.storage.local.set({ tailscaleTokens: updatedTokens });
			log('Tokens appended to storage with timestamp.', 'INFO', 'Tokens');
			await browser.runtime.sendMessage({
				action: 'tokensUpdated',
				tokens: updatedTokens,
			});
		} catch (err) {
			log(
				`Failed to update tokens in storage or send message: ${err}`,
				'ERROR',
				'Tokens',
			);
		}

		if (newTokens.length > 0) {
			await notifyNewTokens(newTokens, result);
		}
	} catch (err) {
		log(`Failed to store tokens: ${err}`, 'ERROR', 'Tokens');
	}
};

export const extractTailnetNameFromToken = (token: string) => {
	const match = token.match(/^([^.]+(?:-[^.]+)?)\.ts\.net/);
	return match ? match[0] : token;
};

export const filterValidTokens = (
	tokens: Token[],
	now: number = Date.now(),
): Token[] => {
	return (tokens || []).filter(
		(t) =>
			typeof t.timestamp === 'number' &&
			now - t.timestamp < tokenValidityInterval * 1000,
	);
};
