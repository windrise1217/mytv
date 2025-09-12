import type { FC } from 'react';

interface FAQModalProps {
	show: boolean;
	onClose: () => void;
}

const FAQModal: FC<FAQModalProps> = ({ show, onClose }) => {
	return (
		<div
			className={`fixed inset-0 flex items-center justify-center bg-background bg-opacity-40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
				show ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
			aria-modal="true"
			role="dialog"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			onKeyDown={(e) => {
				if (e.key === 'Escape') onClose();
			}}
			tabIndex={-1}
		>
			<div
				className={`rounded-md shadow-2xl p-6 bg-header max-w-md mx-auto flex flex-col border border-border transform transition-all duration-300 ${
					show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
				}`}
			>
				<h2 className="text-2xl font-bold text-subtext mb-2">FAQ</h2>
				<div className="flex flex-col gap-3 pb-3 text-text mb-2">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-semibold">What is tailname?</h3>

						<p className="text-sm">
							tailname is a browser extension that finds custom tailnet name
							offers for your Tailscale account.
						</p>
					</div>

					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-semibold">
							How do I use the extension?
						</h3>

						<p className="text-sm">
							You'll need to add at least one keyword in the "Manage tailnet
							words" screen. After that, the extension will begin the checking
							offers process.
						</p>

						<p className="text-sm">
							The extension will notify you if it finds a tailnet name offer
							that matches one of your keywords or combos.
						</p>
					</div>

					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-semibold">
							Why can't I find a tailnet name offer?
						</h3>

						<p className="text-sm">
							It's recommended you add multiple words to find offers quicker.
							All this extension does is request the Tailscale offers API, and
							then filter the results using your keywords and combos.
						</p>
					</div>

					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-semibold">
							I found a bug! Where can I report it?
						</h3>

						<p className="text-sm">
							Please visit{' '}
							<a
								href="https://github.com/SapphoSys/tailname"
								className="text-pink hover:opacity-80 hover:underline transition-opacity"
								target="_blank"
								rel="noopener"
							>
								the GitHub repository
							</a>{' '}
							and file a bug report.
						</p>
					</div>
				</div>

				<div className="flex gap-2">
					<button
						className="px-4 py-2 rounded-lg bg-accent text-text font-medium hover:opacity-80 transition-opacity"
						type="button"
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default FAQModal;
