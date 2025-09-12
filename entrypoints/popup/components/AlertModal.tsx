import type { FC, RefObject } from 'react';
import { useId } from 'react';

interface AlertModalProps {
	showAlert: boolean;
	alertMessage: string;
	alertModalRef: RefObject<HTMLDivElement | null>;
	alertCloseBtnRef: RefObject<HTMLButtonElement | null>;
	handleAlertCloseModal: () => void;
}
const AlertModal: FC<AlertModalProps> = ({
	showAlert,
	alertMessage,
	alertModalRef,
	alertCloseBtnRef,
	handleAlertCloseModal,
}) => {
	const alertMessageId = useId();

	return (
		<div
			ref={alertModalRef}
			tabIndex={-1}
			className={`fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 ${
				showAlert ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
			role="dialog"
			aria-modal="true"
		>
			<div
				className={`rounded-md shadow-2xl p-6 bg-header max-w-md mx-auto flex flex-col border text-text border-border transform transition-all duration-300 ${
					showAlert ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
				}`}
				tabIndex={-1}
			>
				<span id={alertMessageId} className="block mb-4 text-lg text-gray-800">
					{alertMessage.split('\n').map((line) => (
						<span key={line} className="block mb-3">
							{line}
						</span>
					))}
				</span>

				<button
					ref={alertCloseBtnRef as RefObject<HTMLButtonElement>}
					className="px-4 py-2 bg-accent text-text rounded-md hover:opacity-80 transition-opacity focus:outline-none"
					type="button"
					onClick={handleAlertCloseModal}
				>
					OK
				</button>
			</div>
		</div>
	);
};

export default AlertModal;
