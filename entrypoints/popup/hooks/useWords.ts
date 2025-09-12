import { useEffect, useState } from 'react';
import { fetchAndCacheWords } from '$helpers/words';

// Custom hook for fetching and caching tailnet words
export const useWords = () => {
	const [tails, setTails] = useState<string[]>([]);
	const [scales, setScales] = useState<string[]>([]);
	useEffect(() => {
		fetchAndCacheWords().then(({ tails, scales }) => {
			setTails(tails);
			setScales(scales);
		});
	}, []);

	return { tails, scales };
};
