import { updateBadgeText } from '$background/badge';
import { log } from '$helpers/logging';
import type { Message } from '$types/messages';

export const handleGetNextAlarm = async (
	_message: Message,
	sendResponse: (resp: unknown) => void,
) => {
	const alarm = await browser.alarms.get('checkOffersAlarm');
	if (alarm?.scheduledTime) {
		const now = Date.now();
		const timeRemaining = Math.max(
			0,
			Math.round((alarm.scheduledTime - now) / 1000),
		);
		sendResponse({ timeRemaining });
	} else {
		sendResponse({ timeRemaining: null });
	}
};

export const handleSetAlarmInterval = async (
	message: Message,
	sendResponse: (resp: unknown) => void,
) => {
	const interval = message.interval as number;
	const alarm = await browser.alarms.get('checkOffersAlarm');

	if (alarm) {
		await browser.alarms.clear('checkOffersAlarm');
		await browser.alarms.create('checkOffersAlarm', {
			periodInMinutes: interval / 60,
		});

		log(
			`Alarm 'checkOffersAlarm' interval updated to ${interval} seconds (restarted).`,
			'INFO',
			'Alarms',
		);

		updateBadgeText();
		sendResponse({ success: true });
	} else {
		sendResponse({ success: false, reason: 'Alarm not running.' });
	}
};
