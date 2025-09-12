import { useMemo } from 'react';

const isCombo = (val: string, tails: string[], scales: string[]) => {
	const parts = val.split('-');
	return (
		parts.length === 2 && tails.includes(parts[0]) && scales.includes(parts[1])
	);
};

export const useInputValidation = (
	inputValue: string,
	tails: string[],
	scales: string[],
	tailnetNames: string[],
) => {
	return useMemo(
		() =>
			inputValue &&
			(tails.includes(inputValue) ||
				scales.includes(inputValue) ||
				isCombo(inputValue, tails, scales)) &&
			!tailnetNames.includes(inputValue),
		[inputValue, tails, scales, tailnetNames],
	);
};
