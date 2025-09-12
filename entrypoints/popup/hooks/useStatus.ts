import { useCallback } from 'react';

export const useStatus = (
	setStatus: (status: 'Running' | 'Stopped') => void,
) => {
	const handleStart = useCallback(() => {
		browser.runtime.sendMessage({ action: 'startCheck' }, (response) => {
			setStatus(response?.status || 'Running');
		});
	}, [setStatus]);

	const handleStop = useCallback(() => {
		browser.runtime.sendMessage({ action: 'stopCheck' }, (response) => {
			setStatus(response?.status || 'Stopped');
		});
	}, [setStatus]);

	return { handleStart, handleStop };
};
