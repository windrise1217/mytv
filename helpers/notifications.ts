import { log } from '$helpers/logging';
import type { DefaultStorageOptions } from '$types/storage';

export const openDnsTabWithNotification = async () => {
	await browser.tabs.create({ url: 'https://login.tailscale.com/admin/dns' });
	browser.notifications.create({
		type: 'basic',
		iconUrl: browser.runtime.getURL('/icons/128.png'),
		title: 'Tailscale DNS Page Opened',
		message:
			'Please re-open the extension window to continue the claim process.',
	});
};

export const buildSystemNotificationOptions = (
	message: string,
): Browser.notifications.NotificationCreateOptions => ({
	type: 'basic',
	iconUrl: browser.runtime.getURL('/icons/128.png'),
	title: 'Tailnet name offer found!',
	message,
});

export const buildNtfyNotificationOptions = (
	token: string,
): Record<string, string> => ({
	Title: `Tailnet name offer found!`,
	Priority: '3',
	Tags: 'key',
	...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const notifyNewTokens = async (
	newTokens: string[],
	result: DefaultStorageOptions,
) => {
	const tailnetNamesOnly = newTokens.map((token) => token.split('/')[0]);
	const messageText = `New offer${
		newTokens.length > 1 ? 's' : ''
	} found: ${tailnetNamesOnly.join(', ')}. Hurry, it expires in 5 minutes!`;

	if (result.useSystemPush) {
		try {
			await browser.notifications.create(
				buildSystemNotificationOptions(messageText),
			);
		} catch (err) {
			log(
				`Failed to create notification for new offers: ${err}`,
				'ERROR',
				'Notifications',
			);
		}
	}

	if (result.useNtfyPush) {
		const ntfyUrl = (result.ntfyUrl || '').replace(/\/$/, '');
		const ntfyTopic = result.ntfyTopic || '';
		const ntfyToken = result.ntfyToken || '';
		if (ntfyUrl && ntfyTopic) {
			try {
				await fetch(`${ntfyUrl}/${ntfyTopic}`, {
					method: 'POST',
					headers: buildNtfyNotificationOptions(ntfyToken),
					body: messageText,
				});
			} catch (err) {
				log(
					`Failed to send ntfy notification for new offers: ${err}`,
					'ERROR',
					'Notifications',
				);
			}
		}
	}
};
