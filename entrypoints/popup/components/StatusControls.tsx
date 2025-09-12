import { type FC, useEffect, useState } from 'react';
import { BiLoaderAlt, BiPlay, BiSolidCog, BiStop } from 'react-icons/bi';
import { MdOutlineWarning } from 'react-icons/md';
import SettingsModal from '$components/SettingsModal';
import { useNotificationSettings } from '$hooks/useNotificationSettings';
import { useSettings } from '$hooks/useSettings';

interface StatusControlsProps {
	status: string;
	timer: number | null;
	handleStart: () => void;
	handleStop: () => void;
	tailnetNames: string[];
	redirectToTailnetList: () => void;
}

const StatusControls: FC<StatusControlsProps> = ({
	status,
	timer,
	handleStart,
	handleStop,
	tailnetNames,
	redirectToTailnetList,
}) => {
	const settings = useSettings(30);
	const [showMessage, setShowMessage] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const [hasBeenToggled, setHasBeenToggled] = useState(false);
	const [pendingAction, setPendingAction] = useState<'start' | null>(null);
	const notificationsEnabled = useNotificationSettings();

	// Only show loading if pendingAction is 'start' and status is not yet updated
	const isLoading = pendingAction === 'start' && status === 'Stopped';

	useEffect(() => {
		let timer: NodeJS.Timeout;

		if (status !== 'Stopped') {
			setShouldRender(true);
			timer = setTimeout(
				() => {
					setShowMessage(true);
				},
				hasBeenToggled ? 50 : 0,
			);
			// Clear pendingAction when UI is ready (status is running and message is shown)
			if (pendingAction === 'start' && showMessage) setPendingAction(null);
		} else {
			setShowMessage(false);
			timer = setTimeout(
				() => {
					setShouldRender(false);
				},
				hasBeenToggled ? 200 : 0,
			);
			// No pendingAction logic for stop
		}

		return () => clearTimeout(timer);
	}, [status, hasBeenToggled, pendingAction, showMessage]);

	const handleStartClick = async () => {
		setHasBeenToggled(true);
		setPendingAction('start');
		await Promise.resolve(handleStart());
	};

	const handleStopClick = async () => {
		await Promise.resolve(handleStop());
	};

	return (
		<>
			<div className="flex gap-3 pb-4 justify-center items-center">
				{status === 'Stopped' ? (
					<button
						className="px-4 py-2 rounded-lg bg-accent flex flex-row items-center gap-1 text-text text-sm font-medium disabled:opacity-50 hover:opacity-80 transition-opacity disabled:cursor-not-allowed"
						type="button"
						onClick={handleStartClick}
						disabled={tailnetNames.length === 0 || isLoading}
					>
						{isLoading ? (
							<BiLoaderAlt
								className="inline-block animate-spin"
								size={20}
								aria-hidden={true}
							/>
						) : (
							<BiPlay className="inline-block" size={20} aria-hidden={true} />
						)}
						Start
					</button>
				) : (
					<button
						className="px-4 py-2 rounded-lg bg-danger flex flex-row items-center gap-1 text-text text-sm font-medium disabled:opacity-50 hover:opacity-80 transition-opacity disabled:cursor-not-allowed"
						type="button"
						onClick={handleStopClick}
					>
						<BiStop className="inline-block" size={20} aria-hidden={true} />
						Stop
					</button>
				)}
				<button
					className="px-3 py-2 rounded-lg bg-item flex flex-row items-center gap-2 border border-border text-text text-sm font-medium hover:opacity-80 transition-opacity ml-2"
					type="button"
					aria-label="Settings"
					onClick={settings.open}
				>
					<BiSolidCog className="inline-block" size={20} aria-hidden={true} />
					Settings
				</button>
			</div>
			     
			<SettingsModal
				visible={settings.visible}
				shouldRender={settings.shouldRender}
				interval={settings.interval}
				setInterval={settings.setInterval}
				onClose={settings.close}
			/>
			     
			{tailnetNames.length === 0 && (
				<div className="flex">
					<button
						className="w-full text-sm text-center border border-border text-text bg-item mx-4 rounded-md mb-4 py-4 items-center  cursor-pointer hover:scale-105 transition-transform"
						onClick={redirectToTailnetList}
						aria-label="Go to Tailnet List"
						type="button"
					>
						<p>
							<MdOutlineWarning
								className="inline-block text-warning mr-1"
								size={20}
								aria-hidden={true}
							/>
							You'll need to add at least one tailnet word in order to start
							searching.
						</p>

						<p className="font-medium">Click here to start adding words.</p>
					</button>
				</div>
			)}
			     
			{tailnetNames.length !== 0 && shouldRender && (
				<div
					className={`flex flex-col pb-4 ${
						hasBeenToggled ? 'transition-opacity duration-500' : ''
					} ${showMessage ? 'opacity-100' : 'opacity-0'}`}
				>
					<div className="flex flex-col gap-0.5 border text-sm border-border text-text bg-item mx-4 rounded-md p-4">
						<p>
							You can now leave this extension running in the background.{' '}
							{notificationsEnabled ? (
								"You'll receive a notification when a tailnet offer is found that matches one of your words."
							) : (
								<span className="text-warning font-semibold">
									Notifications are currently disabled. You won't receive alerts
									for new tailnet offers.
								</span>
							)}
						</p>

						<p className="text-subtext text-xs">
							Next check in{' '}
							{isLoading
								? `${settings.interval} second${settings.interval === 1 ? '' : 's'}`
								: timer !== null
									? `${timer} second${timer === 1 ? '' : 's'}`
									: `a few second${timer === 1 ? '' : 's'}`}
							.{' '}
							<button
								type="button"
								className="text-subtext font-semibold hover:opacity-80 hover:underline text-xs"
								onClick={settings.open}
								aria-label="Configure interval in settings"
								tabIndex={0}
							>
								[Configure the interval]
							</button>
						</p>
					</div>
				</div>
			)}
			   
		</>
	);
};

export default StatusControls;
