import { updateBadgeText } from '$background/badge';

export const setupStorage = () => {
	browser.storage.onChanged.addListener((changes) => {
		if (changes.tailscaleTokens) {
			updateBadgeText();
		}
	});
};
