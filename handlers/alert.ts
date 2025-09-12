import { log } from '$helpers/logging';
import { openDnsTabWithNotification } from '$helpers/notifications';
import type { Message } from '$types/messages';

const showCustomAlertWithAck = async (
	_sendResponse: (resp: unknown) => void,
) => {
	browser.runtime.sendMessage({
		action: 'showCustomAlert',
		message:
			"This extension will now redirect you to the Tailscale DNS page. This is sadly a limitation of what we can do with Tailscale's claim offers endpoint.\nAfter you're redirected, please re-open the extension window to finish the claim process.",
	});

	const ackListener = async (msg: Message) => {
		if (msg.action === 'userAcknowledgedRedirect') {
			await openDnsTabWithNotification();
			browser.runtime.onMessage.removeListener(ackListener);
		}
	};

	browser.runtime.onMessage.addListener(ackListener);
};

export const showDnsRedirectAlert = async (
	sendResponse: (resp: unknown) => void,
) => {
	const activeTabs = await browser.tabs.query({
		active: true,
		currentWindow: true,
	});
	if (activeTabs && activeTabs.length > 0) {
		showCustomAlertWithAck(sendResponse);
	} else {
		await openDnsTabWithNotification();
	}

	log(
		'No Tailscale admin tab found. Now attempting to open https://login.tailscale.com/admin/dns in a new browser tab.',
		'WARNING',
		'Tokens',
	);

	sendResponse({ success: true, redirected: true });
};
