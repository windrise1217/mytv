import { useEffect, useState } from 'react';
import {
	extractTailnetNameFromToken,
	filterValidTokens,
} from '$helpers/tokens';
import type { RuntimeMessage } from '$types/messages';
import type { Token } from '$types/tokens';

interface UseTokensOptions {
	setLoading?: (v: boolean) => void;
	setAlertMessage?: (v: string) => void;
	setShowAlert?: (v: boolean) => void;
	setClaimedToken?: (v: string) => void;
}

// Custom hook for managing tokens and claiming tokens
export const useTokens = ({
	setLoading,
	setAlertMessage,
	setShowAlert,
	setClaimedToken,
}: UseTokensOptions = {}) => {
	const [tokens, setTokens] = useState<Token[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Load and check for expired tokens once on mount
	useEffect(() => {
		const checkExpiredTokens = () => {
			browser.storage.local.get(['tailscaleTokens'], (result) => {
				const now = Date.now();

				const validTokens: Token[] = filterValidTokens(
					result.tailscaleTokens || [],
					now,
				);

				if (validTokens.length !== (result.tailscaleTokens || []).length) {
					browser.storage.local.set({ tailscaleTokens: validTokens });
				}

				setTokens(validTokens);
			});
		};

		// Check immediately on mount
		checkExpiredTokens();
	}, []);

	useEffect(() => {
		const listener = (message: RuntimeMessage<{ tokens?: Token[] }>) => {
			if (message.action === 'tokensUpdated') {
				const validTokens: Token[] = filterValidTokens(message.tokens || []);
				setTokens(validTokens);
			}
		};
		browser.runtime.onMessage.addListener(listener);
		return () => browser.runtime.onMessage.removeListener(listener);
	}, []);

	// Claim token logic
	const handleClaimToken = async (tokenObj: Token) => {
		if (setLoading) setLoading(true);
		setError(null);

		try {
			const response = await browser.runtime.sendMessage({
				action: 'claimToken',
				tcd: tokenObj.tcd || '',
				token: tokenObj.token,
			});
			if (response?.redirected) {
				// DNS page opened, do not show error or alert
				return;
			}

			if (response?.error) {
				console.error(`[useTokens] Error claiming token:`, response.error);
				if (setAlertMessage && setShowAlert) {
					setAlertMessage(response.error);
					setShowAlert(true);
				} else {
					setError(response.error);
				}
				return;
			}

			if (setAlertMessage && setShowAlert && setClaimedToken) {
				setAlertMessage(
					`Offer claimed! Your tailnet name is now ${extractTailnetNameFromToken(
						tokenObj.token,
					)}.\nYou may need to refresh Tailscale to see the changes take effect.`,
				);
				setShowAlert(true);
				setClaimedToken(tokenObj.token);
				return;
			}
		} catch (e) {
			const errorMsg = e instanceof Error ? e.message : 'Unknown error';

			if (setAlertMessage && setShowAlert) {
				setAlertMessage(`Error claiming token: ${errorMsg}`);
				setShowAlert(true);
			} else {
				setError(errorMsg);
			}
		} finally {
			if (setLoading) setLoading(false);
		}
	};

	// Remove token logic
	const handleRemoveToken = (tokenObj: Token) => {
		const updatedTokens = tokens.filter((t) => t.token !== tokenObj.token);
		setTokens(updatedTokens);
		browser.storage.local.set({ tailscaleTokens: updatedTokens });
	};

	return [
		tokens,
		setTokens,
		{ handleClaimToken, handleRemoveToken, error },
	] as const;
};
