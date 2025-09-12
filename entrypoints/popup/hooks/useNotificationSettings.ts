import { useCallback, useEffect, useState } from 'react';

export const useNotificationSettings = () => {
	const [notificationsEnabled, setNotificationsEnabled] = useState<
		boolean | null
	>(null);

	const fetchNotificationSettings = useCallback(() => {
		browser.storage.local.get(['useSystemPush', 'useNtfyPush'], (result) => {
			const enabled =
				Boolean(result.useSystemPush) || Boolean(result.useNtfyPush);
			setNotificationsEnabled(enabled);
		});
	}, []);

	useEffect(() => {
		fetchNotificationSettings();
	}, [fetchNotificationSettings]);

	useEffect(() => {
		const handleStorageChange = (
			changes: Record<string, Browser.storage.StorageChange>,
			areaName: string,
		) => {
			if (
				areaName === 'local' &&
				('useSystemPush' in changes || 'useNtfyPush' in changes)
			) {
				fetchNotificationSettings();
			}
		};
		browser.storage.onChanged.addListener(handleStorageChange);
		return () => {
			browser.storage.onChanged.removeListener(handleStorageChange);
		};
	}, [fetchNotificationSettings]);

	return notificationsEnabled;
};
