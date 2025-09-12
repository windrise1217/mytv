import { useEffect, useState } from 'react';
import { checkEligibility } from '$helpers/eligibility';
import type { Message } from '$types/messages';

export const useEligibility = () => {
	const [eligibility, setEligibility] = useState<{
		eligible: boolean;
		reason: string;
		id?: string;
	} | null>(null);
	const [eligibilityLoading, setEligibilityLoading] = useState(true);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setEligibilityLoading(true);
		checkEligibility().then((result) => {
			setEligibility(result);
			setEligibilityLoading(false);
			setLoading(false);
		});

		const listener = (message: Message) => {
			if (message.action === 'refreshEligibility') {
				setEligibilityLoading(true);
				checkEligibility().then((result) => {
					setEligibility(result);
					setEligibilityLoading(false);
					setLoading(false);
				});
			}
		};
		browser.runtime.onMessage.addListener(listener);
		return () => browser.runtime.onMessage.removeListener(listener);
	}, []);

	return { eligibility, eligibilityLoading, loading, setLoading };
};
