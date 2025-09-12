import { eligibilityCacheInterval } from '$config';
import { log } from '$helpers/logging';
import { fetchTailscaleOffers, getTailcontrolCookie } from '$helpers/offers';
import type { Eligibility, EligibilityApiResponse } from '$types/eligibility';

const eligibilityMap: Record<string, Eligibility> = {
	apiError: {
		eligible: false,
		reason: 'API error occurred.',
		id: 'api-error',
		error: 'API error',
	},
	eligible: {
		eligible: true,
		reason: 'Eligible for new offers!',
		id: 'eligible',
		offerType: 'reoffer',
	},
	'forbidden - not admin': {
		eligible: false,
		reason:
			'User does not have the Admin role in Tailscale, and thus has insufficient privileges.',
		id: 'not-admin',
		error: 'forbidden - not admin',
	},
	'forbidden - not logged in': {
		eligible: false,
		reason: 'User is not logged in to Tailscale.',
		id: 'not-logged-in',
		error: 'forbidden - not logged in',
	},
	locked: {
		eligible: false,
		reason: 'User already used their tailnet name for an HTTPS certificate.',
		id: 'custom-tailnet',
		offerType: 'locked',
	},
	unknown: {
		eligible: false,
		reason: 'Unknown eligibility state.',
		id: 'unknown',
	},
};

export const parseEligibilityResponse = (
	body: EligibilityApiResponse,
): Eligibility => {
	if (body.error) {
		return {
			...eligibilityMap.apiError,
			reason: `API error: ${body.error}`,
			error: body.error,
		};
	}

	if (body.error && eligibilityMap[body.error])
		return eligibilityMap[body.error];

	if (body.data?.offerType === 'locked') return eligibilityMap.locked;
	if (body.data?.offerType === 'reoffer') return eligibilityMap.eligible;

	return {
		...eligibilityMap.unknown,
		offerType: body.data?.offerType,
	};
};

export const handleEligibilityResult = (eligibility: Eligibility) => {
	eligibility.checkedAt = Date.now();
	browser.storage.local.set({ eligibility });
};

export const checkEligibility = async (): Promise<Eligibility> => {
	log(
		'Checking if the user is eligible for Tailscale offers...',
		'INFO',
		'Eligibility',
	);
	let eligibility: Eligibility = eligibilityMap.unknown;

	const cacheDurationMs = eligibilityCacheInterval * 1000;
	const cached = await browser.storage.local.get('eligibility');
	if (cached.eligibility?.checkedAt) {
		const now = Date.now();
		if (now - cached.eligibility.checkedAt < cacheDurationMs) {
			log('Using cached eligibility response.', 'INFO', 'Eligibility');
			return cached.eligibility;
		}
	}

	try {
		const cookie = await getTailcontrolCookie();
		if (!cookie) {
			eligibility = eligibilityMap['forbidden - not logged in'];
			handleEligibilityResult(eligibility);
			return eligibility;
		}

		const cookieValue = cookie.value;
		const response = await fetchTailscaleOffers(cookieValue);
		const body = await response.json();
		console.log(body);
		eligibility = parseEligibilityResponse(body);
		handleEligibilityResult(eligibility);

		return eligibility;
	} catch (e) {
		const errorMsg = e instanceof Error ? e.message : 'Unknown error';

		eligibility = {
			...eligibilityMap.unknown,
			reason: errorMsg,
			error: errorMsg,
		};

		handleEligibilityResult(eligibility);

		return eligibility;
	} finally {
		log(
			`Eligibility check result: ${eligibility.eligible} (${eligibility.reason})`,
			'INFO',
			'Eligibility',
		);
	}
};
