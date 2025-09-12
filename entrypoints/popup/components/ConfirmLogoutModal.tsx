import type { FC } from 'react';

interface ConfirmLogoutModalProps {
	show: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmLogoutModal: FC<ConfirmLogoutModalProps> = ({
	show,
	onConfirm,
	onCancel,
}) => {
	// Animate modal in/out
	return (
		<div
			className={`fixed inset-0 flex items-center text-text justify-center bg-background bg-opacity-40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
				show ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
		>
			<div
				className={`rounded-md shadow-2xl p-6 bg-header max-w-md mx-auto flex flex-col border border-border transform transition-all duration-300 ${
					show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
				}`}
			>
				<h2 className="text-2xl font-bold mb-2">Log out</h2>
				<div className="flex flex-col gap-2 pb-3">
					<p className="text-base">
						This will log you out from your account. Are you sure?
					</p>

					<p className="text-sm text-subtext">
						You will need to log in again with a different Tailscale account to
						use the extension.
					</p>
				</div>

				<div className="flex gap-2">
					<button
						className="px-4 py-2 rounded-lg bg-danger text-text font-medium hover:opacity-80 transition-opacity"
						onClick={onConfirm}
						type="button"
					>
						Log out
					</button>

					<button
						className="px-4 py-2 rounded-lg bg-item text-text font-medium hover:opacity-80 transition-opacity"
						onClick={onCancel}
						type="button"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmLogoutModal;
