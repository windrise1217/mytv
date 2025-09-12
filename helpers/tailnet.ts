export const getTailnetNames = async (): Promise<string[]> => {
	return await new Promise((resolve) => {
		browser.storage.local.get(['tailnetNames'], (result) => {
			resolve(Array.isArray(result.tailnetNames) ? result.tailnetNames : []);
		});
	});
};

export const validateTailnetNames = (tailnetNames: string[]) => {
	return Array.isArray(tailnetNames) && tailnetNames.length > 0;
};
