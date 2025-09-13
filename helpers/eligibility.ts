import { eligibilityCacheInterval } from '$config';
import { log } from '$helpers/logging';
import { fetchTailscaleOffers, getTailcontrolCookie } from '$helpers/offers';
import type { Eligibility, EligibilityApiResponse } from '$types/eligibility';

export const parseEligibilityResponse = (
	body: EligibilityApiResponse,
): Eligibility => {
	if (body.error) {
		if (body.error === 'forbidden - not admin') {
			return {
				eligible: false,
				reason:
					'User does not have the Admin role in Tailscale, and thus has insufficient privileges.',
				id: 'not-admin',
				error: body.error,
			};
		}

		return {
			eligible: false,
			reason: `API error: ${body.error}`,
			id: 'api-error',
			error: body.error,
		};
	}

	if (body.data && body.data.offerType === 'locked') {
		return {
			eligible: false,
			reason: 'User already used their tailnet name for an HTTPS certificate.',
			id: 'custom-tailnet',
			offerType: body.data.offerType,
		};
	}

	return {
		eligible: true,
		reason: 'Eligible!',
		id: 'eligible',
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
	let eligibility: Eligibility = {
		eligible: false,
		reason: 'Unknown',
		id: 'unknown',
	};

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
			eligibility.reason =
				'Tailcontrol cookie not found. User must log in to Tailscale.';
			eligibility.eligible = false;
			eligibility.id = 'not-logged-in';
			handleEligibilityResult(eligibility);
			return eligibility;
		}

		const cookieValue = cookie.value;
		const response = await fetchTailscaleOffers(cookieValue);
		const body = await response.json();
		eligibility = parseEligibilityResponse(body);
		handleEligibilityResult(eligibility);

		return eligibility;
	} catch (e: unknown) {
		const errorMsg = e instanceof Error ? e.message : 'Unknown error';

		eligibility.reason = errorMsg;
		eligibility.id = 'unknown-error';
		eligibility.eligible = false;
		eligibility.error = errorMsg;
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
