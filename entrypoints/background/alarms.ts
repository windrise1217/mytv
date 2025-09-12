import { updateBadgeText } from '$background/badge';
import { badgeUpdateInterval } from '$config';
import { log } from '$helpers/logging';
import { checkTailscaleOffers } from '$helpers/offers';
import { filterValidTokens } from '$helpers/tokens';

export const setupAlarms = () => {
	browser.alarms.create('badgeUpdateAlarm', {
		periodInMinutes: badgeUpdateInterval / 60,
	});

	browser.alarms.onAlarm.addListener((alarm) => {
		log(`Alarm "${alarm.name}" triggered.`, 'DEBUG', 'Alarms');

		if (alarm.name === 'checkOffersAlarm') {
			checkTailscaleOffers();
			updateBadgeText();
		}

		if (alarm.name === 'badgeUpdateAlarm') {
			log(
				'Updating the badge counter and cleaning expired offers...',
				'INFO',
				'Alarms',
			);

			browser.storage.local.get(['tailscaleTokens'], (result) => {
				const now = Date.now();
				const validTokens = filterValidTokens(
					result.tailscaleTokens || [],
					now,
				);

				if (validTokens.length !== (result.tailscaleTokens || []).length) {
					browser.storage.local.set({ tailscaleTokens: validTokens }, () => {
						browser.runtime.sendMessage({
							action: 'tokensUpdated',
							tokens: validTokens,
						});
						log('Expired offers removed.', 'INFO', 'Alarms');
						updateBadgeText();
					});
				} else {
					// Update the badges anyway, even if no offers were removed
					updateBadgeText();
				}
			});
		}
	});
};
