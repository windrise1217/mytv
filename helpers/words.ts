import { tailscaleWordsUrls } from '$config';

export const fetchAndCacheWords = (): Promise<{
	tails: string[];
	scales: string[];
}> => {
	return new Promise((resolve) => {
		browser.storage.local.get(
			['tailnetTails', 'tailnetScales'],
			async (result) => {
				if (
					Array.isArray(result.tailnetTails) &&
					result.tailnetTails.length > 0 &&
					Array.isArray(result.tailnetScales) &&
					result.tailnetScales.length > 0
				) {
					resolve({ tails: result.tailnetTails, scales: result.tailnetScales });
					return;
				}

				try {
					const responses = await Promise.all(
						tailscaleWordsUrls.map((url) => fetch(url)),
					);
					const texts = await Promise.all(responses.map((r) => r.text()));
					const tails = Array.from(
						new Set(
							texts[0]
								.split(/\r?\n/)
								.map((w) => w.trim())
								.filter((w) => w.length > 0),
						),
					);
					const scales = Array.from(
						new Set(
							texts[1]
								.split(/\r?\n/)
								.map((w) => w.trim())
								.filter((w) => w.length > 0),
						),
					);

					browser.storage.local.set(
						{ tailnetTails: tails, tailnetScales: scales },
						() => {
							resolve({ tails, scales });
						},
					);
				} catch {
					resolve({ tails: [], scales: [] });
				}
			},
		);
	});
};
