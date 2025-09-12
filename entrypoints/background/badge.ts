import { badgeColors } from '$config';
import { log } from '$helpers/logging';
import type { Token } from '$types/tokens';

export const updateBadgeText = async () => {
	try {
		const result = await browser.storage.local.get(['tailscaleTokens']);
		const tokens: Token[] = Array.isArray(result.tailscaleTokens)
			? result.tailscaleTokens
			: [];
		const validTokens = tokens.filter((t) => t?.token);
		const count = validTokens.length;

		const badgeText = count > 0 ? count.toString() : '0';
		const badgeColor = count > 0 ? badgeColors.active : badgeColors.inactive;

		if (browser.action) {
			await browser.action.setBadgeText({ text: badgeText });
			await browser.action.setBadgeBackgroundColor({ color: badgeColor });
		} else if (browser.browserAction) {
			await browser.browserAction.setBadgeText({ text: badgeText });
			await browser.browserAction.setBadgeBackgroundColor({
				color: badgeColor,
			});
		}
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : 'Unknown error';
		log(`Failed to update badge text: ${errMsg}`);
	}
};
