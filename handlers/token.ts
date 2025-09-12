import { updateBadgeText } from '$background/badge';
import { showDnsRedirectAlert } from '$handlers/alert';
import { log } from '$helpers/logging';
import type { Message } from '$types/messages';

const injectAndClaimToken = async (
	tabId: number,
	tcd: unknown,
	token: unknown,
	sendResponse: (resp: unknown) => void,
) => {
	await browser.scripting.executeScript({
		target: { tabId },
		files: ['content-scripts/content.js'],
	});

	try {
		const response = await browser.tabs.sendMessage(tabId, {
			action: 'claimToken',
			tcd,
			token,
		});

		log(
			`Content script claim response: ${JSON.stringify(response)}`,
			'DEBUG',
			'Messaging',
		);

		updateBadgeText();
		sendResponse(response);
	} catch (err) {
		log(
			`Error while sending the claimToken alarm: ${err}`,
			'ERROR',
			'Messaging',
		);
		updateBadgeText();

		const errorMsg = err instanceof Error ? err.message : 'Unknown error';
		sendResponse({ success: false, error: errorMsg });
	}
};

export const handleClaimToken = async (
	message: Message,
	sendResponse: (resp: unknown) => void,
) => {
	const { tcd, token } = message;

	log(
		'Forwarding claimToken request to content script. Awaiting response...',
		'INFO',
		'Messaging',
	);

	const tabs = await browser.tabs.query({
		url: 'https://login.tailscale.com/admin/dns',
	});
	if (!tabs || tabs.length === 0) {
		await showDnsRedirectAlert(sendResponse);
		return;
	}

	// biome-ignore lint/style/noNonNullAssertion: We're force injecting here just in case the user already has the DNS page open.
	const tabId = tabs[0].id!;
	await injectAndClaimToken(tabId, tcd, token, sendResponse);
};
