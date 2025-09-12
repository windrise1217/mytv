import { useCallback, useEffect, useState } from 'react';
import { getTailnetNames } from '$helpers/tailnet';

const isCombo = (val: string, tails: string[], scales: string[]) => {
	const parts = val.split('-');
	return (
		parts.length === 2 && tails.includes(parts[0]) && scales.includes(parts[1])
	);
};

export const useTailnetNames = (
	tails: string[],
	scales: string[],
	setStatus: (status: 'Running' | 'Stopped') => void,
	inputValue: string,
	setInputValue: (v: string) => void,
) => {
	const [tailnetNames, setTailnetNames] = useState<string[]>([]);

	useEffect(() => {
		getTailnetNames().then(setTailnetNames);
	}, []);

	const isValid = useCallback(
		(val: string) => {
			return (
				(val && tails.includes(val)) ||
				(val && scales.includes(val)) ||
				isCombo(val, tails, scales)
			);
		},
		[tails, scales],
	);

	const handleAddTailnet = useCallback(() => {
		if (
			inputValue &&
			isValid(inputValue) &&
			!tailnetNames.includes(inputValue)
		) {
			const updated = [...tailnetNames, inputValue];
			setTailnetNames(updated);
			browser.storage.local.set({ tailnetNames: updated });
			setInputValue('');
		}
	}, [inputValue, tailnetNames, setInputValue, isValid]);

	const handleRemoveTailnet = useCallback(
		(name: string) => {
			const updated = tailnetNames.filter((n) => n !== name);
			setTailnetNames(updated);
			browser.storage.local.set({ tailnetNames: updated });
			if (updated.length === 0) {
				browser.runtime.sendMessage({ action: 'stopCheck' }, (response) => {
					setStatus(response?.status || 'Stopped');
				});
			}
		},
		[tailnetNames, setStatus],
	);

	return {
		tailnetNames,
		setTailnetNames,
		handleAddTailnet,
		handleRemoveTailnet,
	};
};
