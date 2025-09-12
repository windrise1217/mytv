import { log } from '$helpers/logging';

export const setupNotifications = () => {
	browser.runtime.onInstalled.addListener(() => {
		browser.storage.local.get(['useSystemPush', 'useNtfyPush'], (result) => {
			const updates: Record<string, boolean> = {};
			if (typeof result.useSystemPush !== 'boolean')
				updates.useSystemPush = true;
			if (typeof result.useNtfyPush !== 'boolean') updates.useNtfyPush = false;
			if (Object.keys(updates).length > 0) {
				browser.storage.local.set(updates, () => {
					log(
						'Initialized default notification settings in storage.',
						'DEBUG',
						'Storage',
					);
				});
			}
		});
	});
};
