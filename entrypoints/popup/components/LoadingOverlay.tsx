import type { FC } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

interface LoadingOverlayProps {
	loading: boolean;
	eligibilityLoading: boolean;
}

const LoadingOverlay: FC<LoadingOverlayProps> = ({
	loading,
	eligibilityLoading,
}) => {
	if (!(eligibilityLoading || loading)) return null;

	// Determine which loading state to show
	const isEligibility = eligibilityLoading && !loading;
	const isRegular = loading && !eligibilityLoading;
	const isBoth = eligibilityLoading && loading;

	let loadingText = 'Loading...';
	if (isEligibility && !isBoth) {
		loadingText = 'Checking eligibility...';
	}

	if (isRegular && !isBoth) {
		loadingText = 'Processing...';
	}

	if (isBoth) {
		loadingText = 'Checking eligibility and processing...';
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-80 z-50 backdrop-blur-sm">
			<div className="text-text rounded-2xl shadow-lg p-6 bg-header max-w-lg mx-auto flex flex-col items-center">
				<BiLoaderAlt
					className="loading-icon text-4xl mb-4 animate-spin-fast"
					aria-hidden={true}
				/>

				<span className="loading-text text-blue-600 text-lg font-medium">
					{loadingText}
				</span>
			</div>
		</div>
	);
};

export default LoadingOverlay;
