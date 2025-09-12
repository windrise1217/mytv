import { type FC, useEffect, useState } from 'react';
import ConfirmLogoutModal from '$components/ConfirmLogoutModal';
import type { Eligibility } from '$types/eligibility';

interface EligibilityModalProps {
	eligibility: Eligibility | null;
	eligibilityLoading: boolean;
}

const EligibilityModal: FC<EligibilityModalProps> = ({
	eligibility,
	eligibilityLoading,
}) => {
	const [showConfirmLogout, setShowConfirmLogout] = useState(false);
	const [visible, setVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	// Animate modal in/out
	useEffect(() => {
		if (!eligibilityLoading && eligibility && !eligibility.eligible) {
			setShouldRender(true);
			setTimeout(() => setVisible(true), 10); // pop in
		} else if (visible) {
			setVisible(false);
			setTimeout(() => setShouldRender(false), 300); // fade out
		} else {
			setShouldRender(false);
		}
	}, [eligibilityLoading, eligibility, visible]);

	const handleLogoutClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setShowConfirmLogout(true);
	};
	const handleConfirmLogout = () => {
		setShowConfirmLogout(false);
		window.open('https://login.tailscale.com/logout', '_blank');
		browser.storage.local.remove('eligibility');
	};
	const handleCancelLogout = () => {
		setShowConfirmLogout(false);
	};
	if (!shouldRender || !eligibility) return null;
	return (
		<div
			className={`fixed inset-0 flex items-center justify-center bg-background bg-opacity-40 backdrop-blur-sm shadow-[#000] transition-opacity duration-300 ${
				visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
			aria-modal="true"
			role="dialog"
		>
			<div
				className={`text-text shadow-[#000] rounded-md shadow-2xl p-6 bg-header max-w-lg mx-auto flex flex-col border border-border transform transition-all duration-300 ${
					visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
				}`}
			>
				<div className="flex flex-col flex-wrap gap-x-2 mb-2">
					<h2 className="text-2xl font-bold">
						{eligibility.id === 'not-logged-in'
							? 'Not logged in'
							: eligibility.id === 'api-error'
								? 'API Error'
								: 'Not Eligible'}
					</h2>
					<p className="text-base text-subtext">({eligibility.id})</p>
				</div>
				<div className="text-base text-danger mb-2">
					{eligibility.id === 'not-logged-in'
						? 'You must be logged in to Tailscale to use this extension.'
						: eligibility.reason}
				</div>
				<div className="text-sm text-subtext">
					{eligibility.id === 'not-logged-in'
						? 'When you login, the extension will refresh.'
						: 'Please log out and try another Tailscale account.'}
				</div>
				<div className="login-btn-row flex gap-2 mt-4">
					{eligibility.id === 'not-logged-in' ? (
						<a
							href="https://login.tailscale.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<button
								className="login-btn px-4 py-2 rounded-lg bg-accent text-text font-medium hover:opacity-80 transition-opacity"
								type="button"
							>
								Log in
							</button>
						</a>
					) : (
						<button
							className="login-btn px-4 py-2 rounded-lg bg-danger text-text font-medium hover:opacity-80 transition-opacity"
							type="button"
							onClick={handleLogoutClick}
						>
							Log out
						</button>
					)}
					{eligibility.id === 'custom-tailnet' && (
						<a
							href="https://tailscale.com/kb/1217/tailnet-name"
							target="_blank"
							rel="noopener noreferrer"
						>
							<button
								className="login-btn learn-more px-4 py-2 rounded-lg bg-accent text-text font-medium hover:opacity-80 transition-opacity"
								type="button"
							>
								Learn more
							</button>
						</a>
					)}
				</div>
			</div>
			<ConfirmLogoutModal
				show={showConfirmLogout}
				onConfirm={handleConfirmLogout}
				onCancel={handleCancelLogout}
			/>
		</div>
	);
};

export default EligibilityModal;
