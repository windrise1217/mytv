import { useCallback, useEffect, useState } from 'react';

export const useTimer = () => {
	const [status, setStatus] = useState<'Running' | 'Stopped'>('Stopped');
	const [timer, setTimer] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchAndSetTimer = useCallback(() => {
		browser.runtime.sendMessage({ action: 'getNextAlarm' }, (resp) => {
			setTimer(resp?.timeRemaining ?? null);
		});
	}, []);

	useEffect(() => {
		browser.runtime.sendMessage({ action: 'getStatus' }, (response) => {
			setStatus(response?.status || 'Stopped');
			setLoading(false);
			if (response?.status === 'Running') {
				fetchAndSetTimer();
			}
		});
	}, [fetchAndSetTimer]);

	useEffect(() => {
		if (status === 'Running') {
			fetchAndSetTimer(); // Ensure timer is set immediately on status change
			const interval = setInterval(fetchAndSetTimer, 1000);
			return () => clearInterval(interval);
		} else {
			setTimer(null);
		}
	}, [status, fetchAndSetTimer]);

	return { status, setStatus, timer, loading, setLoading };
};
