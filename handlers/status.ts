import { updateBadgeText } from '$background/badge';
import { defaultCheckOffersInterval } from '$config';
import { log } from '$helpers/logging';
import { checkTailscaleOffers } from '$helpers/offers';
import type { Message } from '$types/messages';

export const handleStartCheck = async (
	_message: Message,
	sendResponse: (resp: unknown) => void,
) => {
	const result = await browser.storage.local.get(['checkInterval']);
	const interval = result.checkInterval || defaultCheckOffersInterval; // default 60 seconds
	browser.alarms.create('checkOffersAlarm', { periodInMinutes: interval / 60 });
	log(
		`Checking offers process initialized. Interval set to check every ${interval} seconds.`,
		'INFO',
		'Alarms',
	);
	await checkTailscaleOffers();
	updateBadgeText();
	sendResponse({ status: 'Running' });
};

export const handleStopCheck = async (
	_message: Message,
	sendResponse: (resp: unknown) => void,
) => {
	browser.alarms.clear('checkOffersAlarm');
	log('Checking offers process manually stopped by user.', 'INFO', 'Alarms');
	updateBadgeText();
	sendResponse({ status: 'Stopped' });
};

export const handleGetStatus = async (
	_message: Message,
	sendResponse: (resp: unknown) => void,
) => {
	const alarm = await browser.alarms.get('checkOffersAlarm');
	sendResponse({ status: alarm ? 'Running' : 'Stopped' });
};
