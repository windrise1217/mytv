import { setupAlarms } from '$background/alarms';
import { updateBadgeText } from '$background/badge';
import { setupCookies } from '$background/cookies';
import { setupMessaging } from '$background/messaging';
import { setupNotifications } from '$background/notifications';
import { setupStorage } from '$background/storage';
import { log } from '$helpers/logging';

export default defineBackground(() => {
	log('Setting up alarms and event listeners...', 'DEBUG', 'Setup');

	// Update badge on startup
	updateBadgeText();

	// Setup listeners
	setupAlarms();
	setupCookies();
	setupMessaging();
	setupNotifications();
	setupStorage();

	log('Background setup complete.', 'DEBUG', 'Setup');
});
