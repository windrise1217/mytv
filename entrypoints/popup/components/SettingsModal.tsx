import { type FC, useEffect, useId, useRef, useState } from 'react';
import AlertModal from './AlertModal';

interface SettingsModalProps {
	visible: boolean;
	shouldRender: boolean;
	interval: number;
	setInterval: (val: number) => void;
	onClose: () => void;
}

const SettingsModal: FC<SettingsModalProps> = ({
	visible,
	shouldRender,
	interval,
	setInterval,
	onClose,
}) => {
	const [inputValue, setInputValue] = useState(String(interval));
	const [isClosing, setIsClosing] = useState(false);
	const [ntfyUrl, setNtfyUrl] = useState('');
	const [ntfyTopic, setNtfyTopic] = useState('');
	const [ntfyToken, setNtfyToken] = useState('');
	const [activeTab, setActiveTab] = useState<'general' | 'notifications'>(
		'general',
	);
	const [useSystemPush, setUseSystemPush] = useState(true);
	const [useNtfyPush, setUseNtfyPush] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [ntfyLoading, setNtfyLoading] = useState(false);
	const [tabTransitioning, setTabTransitioning] = useState(false);

	const alertModalRef = useRef<HTMLDivElement | null>(null);
	const alertCloseBtnRef = useRef<HTMLButtonElement | null>(null);

	const ntfyUrlId = useId();
	const ntfyTopicId = useId();
	const ntfyTokenId = useId();
	const systemPushId = useId();
	const ntfyPushId = useId();

	useEffect(() => {
		setInputValue(String(interval));
	}, [interval]);

	useEffect(() => {
		if (isClosing) {
			const timer = setTimeout(() => {
				setIsClosing(false);
				onClose();
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [isClosing, onClose]);

	useEffect(() => {
		// Load notification preferences from storage
		browser.storage.local.get(
			['ntfyUrl', 'ntfyTopic', 'ntfyToken', 'useSystemPush', 'useNtfyPush'],
			(result) => {
				if (result.ntfyUrl) setNtfyUrl(result.ntfyUrl);
				if (result.ntfyTopic) setNtfyTopic(result.ntfyTopic);
				if (result.ntfyToken) setNtfyToken(result.ntfyToken);
				if (typeof result.useSystemPush === 'boolean')
					setUseSystemPush(result.useSystemPush);
				if (typeof result.useNtfyPush === 'boolean')
					setUseNtfyPush(result.useNtfyPush);
			},
		);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleClose = () => {
		let val = Number(inputValue);
		if (Number.isNaN(val) || inputValue.trim() === '') val = interval;
		if (val < 5) val = 5;
		setInputValue(String(val));
		if (val !== interval) {
			setInterval(val);
		}
		setIsClosing(true);
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			setIsClosing(true);
		}
	};

	const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Escape') {
			setIsClosing(true);
		}
	};

	const handleAlertCloseModal = () => {
		setShowAlert(false);
	};

	const handleNtfyTest = async () => {
		if (!ntfyUrl || !ntfyTopic) {
			setAlertMessage('Please enter both server URL and topic.');
			setShowAlert(true);
			return;
		}

		setNtfyLoading(true);

		try {
			const url = `${ntfyUrl.replace(/\/$/, '')}/${ntfyTopic}`;
			const headers: Record<string, string> = { 'Content-Type': 'text/plain' };
			if (ntfyToken) headers.Authorization = `Bearer ${ntfyToken}`;

			const res = await fetch(url, {
				method: 'POST',
				headers,
				body: 'Test notification from Tailscale WXT',
			});

			if (res.ok) {
				setAlertMessage('Test notification sent!');
				setShowAlert(true);
			} else if (res.status === 403) {
				setAlertMessage(
					'Server returned a 403 error. This likely means an auth token is required.',
				);
				setShowAlert(true);
			} else {
				setAlertMessage(`Failed: ${res.status}`);
				setShowAlert(true);
			}
		} catch (err) {
			if (err instanceof Error && err.message === 'Failed to fetch') {
				setAlertMessage(
					'Failed to reach the server. Perhaps the URL is incorrect?',
				);
			} else {
				setAlertMessage(
					`Error: ${err instanceof Error ? err.message : String(err)}`,
				);
			}
			setShowAlert(true);
		}
		setNtfyLoading(false);
	};

	const handleStorageChange =
		<T extends string>(setter: (v: T) => void, key: string) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value as T;
			setter(value);
			browser.storage.local.set({ [key]: value });
		};
	const handleCheckboxChange =
		(setter: (v: boolean) => void, key: string) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const checked = e.target.checked;
			setter(checked);
			browser.storage.local.set({ [key]: checked });
		};

	const handleSystemPushChange = handleCheckboxChange(
		setUseSystemPush,
		'useSystemPush',
	);
	const handleNtfyPushChange = handleCheckboxChange(
		setUseNtfyPush,
		'useNtfyPush',
	);
	const handleNtfyUrlChange = handleStorageChange(setNtfyUrl, 'ntfyUrl');
	const handleNtfyTopicChange = handleStorageChange(setNtfyTopic, 'ntfyTopic');
	const handleNtfyTokenChange = handleStorageChange(setNtfyToken, 'ntfyToken');

	const handleTabSwitch = (tab: 'general' | 'notifications') => {
		if (activeTab !== tab) {
			setTabTransitioning(true);
			setTimeout(() => {
				setTabTransitioning(false);
				setActiveTab(tab);
			}, 250);
		}
	};

	if (!shouldRender && !isClosing) return null;
	return (
		<>
			<div
				className={`fixed inset-0 flex items-center justify-center bg-background bg-opacity-40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
					visible && !isClosing ? 'opacity-100' : 'opacity-0'
				}`}
				aria-modal="true"
				role="dialog"
				onClick={handleBackdropClick}
				onKeyDown={handleBackdropKeyDown}
			>
				<div
					className={`text-text shadow-[#000] rounded-md shadow-2xl p-6 bg-header max-w-md mx-auto flex flex-col border border-border transform transition-all duration-300 ${
						visible && !isClosing
							? 'scale-100 opacity-100'
							: 'scale-95 opacity-0'
					}`}
				>
					<h2 className="text-2xl font-bold mb-2">Settings</h2>
					<div className="flex flex-row gap-2 mb-4">
						<button
							className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150 hover:outline-double hover:outline-2 ${
								activeTab === 'general'
									? 'bg-accent text-text font-bold shadow'
									: 'bg-item text-text hover:bg-accent/10 hover:text-accent'
							}`}
							onClick={() => handleTabSwitch('general')}
							type="button"
							aria-selected={activeTab === 'general'}
							aria-controls="general-tab"
							role="tab"
						>
							General
						</button>
						<button
							className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150 hover:outline-double hover:outline-2 ${
								activeTab === 'notifications'
									? 'bg-accent text-text font-bold shadow'
									: 'bg-item text-text hover:bg-accent/10 hover:text-accent'
							}`}
							onClick={() => handleTabSwitch('notifications')}
							type="button"
							aria-selected={activeTab === 'notifications'}
							aria-controls="notifications-tab"
							role="tab"
						>
							Notifications
						</button>
					</div>

					<div className="min-w-[380px]">
						<div
							className={`transition-all duration-300 ${
								activeTab === 'general'
									? tabTransitioning
										? 'opacity-0 translate-x-4 pointer-events-none'
										: 'opacity-100 translate-x-0'
									: 'opacity-0 pointer-events-none'
							} bg-header`}
							aria-labelledby="general-tab"
							role="tabpanel"
						>
							{activeTab === 'general' && (
								<div className="flex flex-col gap-2">
									<label className="text-base font-medium flex flex-col">
										<span className="text-sm font-medium mb-1">
											Check interval (seconds):
										</span>
										<input
											type="number"
											min={0}
											value={inputValue}
											onChange={handleInputChange}
											className="px-2 py-1 border rounded-md bg-item text-text w-full"
										/>
									</label>

									<div className="gap-0.5 flex flex-col">
										<p className="text-sm text-subtext">
											How often to check Tailscale for new tailnet name offers.
										</p>
										<p className="text-sm text-subtext">
											The minimum value is 5 seconds.
										</p>
									</div>
								</div>
							)}
						</div>

						<div
							className={`transition-all duration-300 ${
								activeTab === 'notifications'
									? tabTransitioning
										? 'opacity-0 -translate-x-4 pointer-events-none'
										: 'opacity-100 translate-x-0'
									: 'opacity-0 pointer-events-none'
							} bg-header`}
							aria-labelledby="notifications-tab"
							role="tabpanel"
						>
							{activeTab === 'notifications' && (
								<div className="flex flex-col gap-3">
									<div className="flex items-center gap-2">
										<input
											id={systemPushId}
											type="checkbox"
											checked={useSystemPush}
											onChange={handleSystemPushChange}
											className="accent-accent w-4 h-4 cursor-pointer"
										/>
										<label
											htmlFor={systemPushId}
											className="text-sm text-text cursor-pointer"
										>
											Use system push notifications
										</label>
									</div>

									<div className="flex items-center gap-2">
										<input
											id={ntfyPushId}
											type="checkbox"
											checked={useNtfyPush}
											onChange={handleNtfyPushChange}
											className="accent-accent w-4 h-4 cursor-pointer"
										/>
										<label
											htmlFor={ntfyPushId}
											className="text-sm text-text cursor-pointer"
										>
											Use ntfy push notifications
										</label>
									</div>

									<p className="text-xs text-subtext">
										You will {!useSystemPush && !useNtfyPush ? 'not ' : ''}
										receive notifications{' '}
										{useSystemPush && useNtfyPush
											? 'via system & ntfy'
											: useSystemPush
												? 'via system'
												: useNtfyPush
													? 'via ntfy'
													: ''}{' '}
										for new tailnet offers.
									</p>

									<div className="flex flex-col gap-2">
										<label
											htmlFor={ntfyUrlId}
											className={`text-sm font-medium ${
												!useNtfyPush ? 'text-subtext' : ''
											}`}
										>
											ntfy server URL
										</label>
										<input
											id={ntfyUrlId}
											type="text"
											value={ntfyUrl}
											onChange={handleNtfyUrlChange}
											disabled={!useNtfyPush}
											placeholder="https://ntfy.sh"
											className={`px-2 py-1 border rounded-md bg-item text-text w-full transition-opacity ${
												!useNtfyPush ? 'opacity-50 cursor-not-allowed' : ''
											}`}
										/>
										<label
											htmlFor={ntfyTopicId}
											className={`text-sm font-medium ${
												!useNtfyPush ? 'text-subtext' : ''
											}`}
										>
											ntfy topic
										</label>
										<input
											id={ntfyTopicId}
											type="text"
											value={ntfyTopic}
											onChange={handleNtfyTopicChange}
											disabled={!useNtfyPush}
											placeholder="tailscale"
											className={`px-2 py-1 border rounded-md bg-item text-text w-full transition-opacity ${
												!useNtfyPush ? 'opacity-50 cursor-not-allowed' : ''
											}`}
										/>
										<label
											htmlFor={ntfyTokenId}
											className={`text-sm font-medium ${
												!useNtfyPush ? 'text-subtext' : ''
											}`}
										>
											ntfy auth token (optional)
										</label>
										<input
											id={ntfyTokenId}
											type="password"
											value={ntfyToken}
											onChange={handleNtfyTokenChange}
											disabled={!useNtfyPush}
											placeholder="tk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
											className={`px-2 py-1 border rounded-md bg-item text-text w-full transition-opacity ${
												!useNtfyPush ? 'opacity-50 cursor-not-allowed' : ''
											} [&::-ms-reveal]:invert`}
										/>
										<button
											type="button"
											disabled={
												!useNtfyPush || !(ntfyUrl && ntfyTopic) || ntfyLoading
											}
											className={`px-3 py-2 rounded-lg text-xs bg-accent text-text font-medium mt-2 transition-opacity flex items-center justify-center gap-2 ${
												!useNtfyPush || !(ntfyUrl && ntfyTopic) || ntfyLoading
													? 'opacity-50 cursor-not-allowed'
													: 'hover:opacity-80'
											}`}
											onClick={handleNtfyTest}
										>
											{ntfyLoading ? (
												<div className="w-4 h-4 text-text border-2 border-gray-300 border-t-accent rounded-full animate-spin"></div>
											) : (
												'Send test notification'
											)}
										</button>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex gap-2 mt-4">
						<button
							className="px-4 py-2 rounded-lg bg-accent text-text font-medium hover:opacity-80 transition-opacity"
							type="button"
							onClick={handleClose}
						>
							Close
						</button>
					</div>
				</div>
			</div>

			<AlertModal
				showAlert={showAlert}
				alertMessage={alertMessage}
				alertModalRef={alertModalRef}
				alertCloseBtnRef={alertCloseBtnRef}
				handleAlertCloseModal={handleAlertCloseModal}
			/>
		</>
	);
};

export default SettingsModal;
