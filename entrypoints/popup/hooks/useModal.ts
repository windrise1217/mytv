import { useCallback, useEffect, useRef } from 'react';
import type { RuntimeMessage } from '$types/messages';
import type { Token } from '$types/tokens';

export const useModal = (
	showAlert: boolean,
	setShowAlert: (v: boolean) => void,
	setAlertMessage: (v: string) => void,
	claimedToken: string | null,
	setClaimedToken: (v: string | null) => void,
	setTokens: (fn: (prevTokens: Token[]) => Token[]) => void,
	setTailnetNames: (v: string[]) => void,
) => {
	const alertModalRef = useRef<HTMLDivElement>(null);
	const alertCloseBtnRef = useRef<HTMLButtonElement>(null);

	const handleAlertCloseModal = useCallback(() => {
		setShowAlert(false);
		setTimeout(() => {
			setAlertMessage('');
		}, 300);
		browser.runtime.sendMessage({ action: 'userAcknowledgedRedirect' });
		if (claimedToken) {
			setTokens((prevTokens: Token[]) =>
				prevTokens.filter((t) => t.token !== claimedToken),
			);
			browser.storage.local.get(['tailscaleTokens'], (result) => {
				const updatedTokens = (result.tailscaleTokens || []).filter(
					(t: Token) => t.token !== claimedToken,
				);
				browser.storage.local.set({ tailscaleTokens: updatedTokens }, () => {
					browser.runtime.sendMessage({ action: 'updateBadge' });
				});
			});
			browser.storage.local.get(['tailnetNames'], (result) => {
				const tailnetName = claimedToken.split('.')[0];
				const updatedNames = (result.tailnetNames || []).filter(
					(n: string) => n !== tailnetName,
				);
				setTailnetNames(updatedNames);
				browser.storage.local.set({ tailnetNames: updatedNames });
			});
			setClaimedToken(null);
		}
	}, [
		setShowAlert,
		setAlertMessage,
		claimedToken,
		setTokens,
		setTailnetNames,
		setClaimedToken,
	]);

	useEffect(() => {
		if (showAlert && alertModalRef.current && alertCloseBtnRef.current) {
			const focusableEls = [alertCloseBtnRef.current];
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Tab') {
					e.preventDefault();
					focusableEls[0].focus();
				}
				if (e.key === 'Escape') {
					handleAlertCloseModal();
				}
			};
			alertModalRef.current.focus();
			alertModalRef.current.addEventListener('keydown', handleKeyDown);
			return () => {
				alertModalRef.current?.removeEventListener('keydown', handleKeyDown);
			};
		}
	}, [showAlert, handleAlertCloseModal]);

	useEffect(() => {
		const listener = (message: RuntimeMessage<{ message?: string }>) => {
			if (message.action === 'showCustomAlert' && message.message) {
				setAlertMessage(message.message);
				setShowAlert(true);
			}
		};
		browser.runtime.onMessage.addListener(listener);
		return () => browser.runtime.onMessage.removeListener(listener);
	}, [setAlertMessage, setShowAlert]);

	return { alertModalRef, alertCloseBtnRef, handleAlertCloseModal };
};
