import { log } from '$helpers/logging';

export const setupCookies = () => {
	browser.cookies.onChanged.addListener((changeInfo) => {
		if (
			changeInfo.cookie?.domain.includes('tailscale.com') &&
			changeInfo.cookie.name === 'tailcontrol'
		) {
			log(
				'Detected change to Tailscale login cookie. Now refreshing eligibility status...',
				'INFO',
				'Cookies',
			);
			browser.storage.local.remove('eligibility');
			browser.runtime.sendMessage({ action: 'refreshEligibility' });
		}
	});
};
