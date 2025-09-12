import { checkEligibility } from '$helpers/eligibility';
import type { Message } from '$types/messages';

export const handleCheckEligibility = async (
	_message: Message,
	sendResponse: (resp: unknown) => void,
) => {
	const result = await checkEligibility();
	sendResponse({ eligibility: result });
};
