import { type FC, useEffect, useState } from 'react';

import AlertModal from '$components/AlertModal';
import EligibilityModal from '$components/EligibilityModal';
import Footer from '$components/Footer';
import LoadingOverlay from '$components/LoadingOverlay';

import { useEligibility } from '$hooks/useEligibility';
import { useInputValidation } from '$hooks/useInputValidation';
import { useModal } from '$hooks/useModal';
import { useStatus } from '$hooks/useStatus';
import { useTailnetNames } from '$hooks/useTailnetNames';
import { useTimer } from '$hooks/useTimer';
import { useTokens } from '$hooks/useTokens';
import { useWords } from '$hooks/useWords';

import MainScreen from '$screens/MainScreen';
import TailnetWordsScreen from '$screens/TailnetWords';
import TokenListScreen from '$screens/TokenList';
import WordListScreen from '$screens/WordList';

const App: FC = () => {
	const [inputValue, setInputValue] = useState('');
	const [error, _setError] = useState<string | null>(null);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [claimedToken, setClaimedToken] = useState<string | null>(null);
	const [screen, setScreen] = useState<
		'main' | 'words' | 'tokens' | 'wordlist'
	>('main');
	const [isTransitioning, setIsTransitioning] = useState(false);

	const handleShowWordsScreen = () => {
		setIsTransitioning(true);
		setScreen('words');
	};
	const handleShowTokensScreen = () => {
		setIsTransitioning(true);
		setScreen('tokens');
	};
	const handleBackToWords = () => {
		setIsTransitioning(true);
		setScreen('words');
	};
	const handleBackToMain = () => {
		setIsTransitioning(true);
		setScreen('main');
	};
	const handleShowWordListScreen = () => {
		setIsTransitioning(true);
		setScreen('wordlist');
	};

	const { status, setStatus, timer, loading, setLoading } = useTimer();
	const { handleStart, handleStop } = useStatus(setStatus);
	const { tails, scales } = useWords();
	const {
		tailnetNames,
		setTailnetNames,
		handleAddTailnet,
		handleRemoveTailnet,
	} = useTailnetNames(tails, scales, setStatus, inputValue, setInputValue);
	const [
		tokens,
		setTokens,
		{ handleClaimToken, handleRemoveToken, error: claimTokenError },
	] = useTokens({
		setLoading,
		setAlertMessage,
		setShowAlert,
		setClaimedToken,
	});

	const { eligibility, eligibilityLoading } = useEligibility();
	const { alertModalRef, alertCloseBtnRef, handleAlertCloseModal } = useModal(
		showAlert,
		setShowAlert,
		setAlertMessage,
		claimedToken,
		setClaimedToken,
		setTokens,
		setTailnetNames,
	);
	const isInputValid = useInputValidation(
		inputValue,
		tails,
		scales,
		tailnetNames,
	);

	useEffect(() => {
		if (isTransitioning) {
			const timer = setTimeout(() => setIsTransitioning(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isTransitioning]);

	return (
		<div className="flex flex-col min-w-[600px] max-w-lg min-h-[600px] bg-background overflow-hidden mx-auto h-full">
			<div className="flex-1 relative flex flex-col h-full">
				<div className="flex-1 relative overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden">
					<div
						className={`absolute inset-0 transition-all duration-500 bg-background ${
							screen === 'main'
								? 'translate-x-0 opacity-100 pointer-events-auto'
								: 'translate-x-[-100%] opacity-0 pointer-events-none'
						}`}
					>
						<MainScreen
							onShowWords={handleShowWordsScreen}
							onShowTokens={handleShowTokensScreen}
							status={status}
							timer={timer}
							handleStart={handleStart}
							handleStop={handleStop}
							tailnetNames={tailnetNames}
							tokens={tokens}
						/>
					</div>

					<div
						className={`absolute inset-0 transition-all duration-500 bg-background ${
							screen === 'words'
								? 'translate-x-0 opacity-100 pointer-events-auto'
								: screen === 'main'
									? 'translate-x-[100%] opacity-0 pointer-events-none'
									: 'translate-x-[-100%] opacity-0 pointer-events-none'
						}`}
					>
						<TailnetWordsScreen
							tailnetNames={tailnetNames}
							handleAddTailnet={handleAddTailnet}
							handleRemoveTailnet={handleRemoveTailnet}
							inputValue={inputValue}
							setInputValue={setInputValue}
							isInputValid={!!isInputValid}
							loading={loading}
							onBack={handleBackToMain}
							error={error}
							tails={tails}
							scales={scales}
							onShowWordList={handleShowWordListScreen}
						/>
					</div>

					<div
						className={`absolute inset-0 transition-all duration-500 bg-background ${
							screen === 'tokens'
								? 'translate-x-0 opacity-100 pointer-events-auto'
								: 'translate-x-[100%] opacity-0 pointer-events-none'
						}`}
					>
						<TokenListScreen
							tokens={tokens}
							handleClaimToken={handleClaimToken}
							handleRemoveToken={handleRemoveToken}
							loading={loading}
							error={claimTokenError}
							onBack={handleBackToMain}
						/>
					</div>

					<div
						className={`absolute inset-0 transition-all duration-500 bg-background ${
							screen === 'wordlist'
								? 'translate-x-0 opacity-100 pointer-events-auto'
								: 'translate-x-[100%] opacity-0 pointer-events-none'
						}`}
					>
						<WordListScreen
							tails={tails}
							scales={scales}
							onBack={handleBackToWords}
						/>
					</div>

					<LoadingOverlay
						eligibilityLoading={eligibilityLoading}
						loading={loading}
					/>
					<EligibilityModal
						eligibility={eligibility}
						eligibilityLoading={eligibilityLoading}
					/>
					<AlertModal
						alertCloseBtnRef={alertCloseBtnRef}
						alertMessage={alertMessage}
						alertModalRef={alertModalRef}
						handleAlertCloseModal={handleAlertCloseModal}
						showAlert={showAlert}
					/>
				</div>

				<Footer />
			</div>
		</div>
	);
};

export default App;
