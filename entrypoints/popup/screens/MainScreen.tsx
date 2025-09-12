import type { FC } from 'react';
import { BiListPlus, BiSolidKey } from 'react-icons/bi';
import ActionCard from '$components/ActionCard';
import HeaderSection from '$components/HeaderSection';
import StatusControls from '$components/StatusControls';
import type { Token } from '$types/tokens';

interface MainScreenProps {
	onShowWords: () => void;
	onShowTokens: () => void;
	status: string;
	timer: number | null;
	handleStart: () => void;
	handleStop: () => void;
	tailnetNames: string[];
	tokens: Token[];
}

const MainScreen: FC<MainScreenProps> = ({
	onShowWords,
	onShowTokens,
	status,
	timer,
	handleStart,
	handleStop,
	tailnetNames,
	tokens,
}) => (
	<main className="rounded-none shadow-lg p-6 w-full h-full">
		<HeaderSection />

		<StatusControls
			handleStart={handleStart}
			handleStop={handleStop}
			status={status}
			tailnetNames={tailnetNames}
			timer={timer}
			redirectToTailnetList={onShowWords}
		/>

		<div className="flex flex-col items-center justify-center gap-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
				<ActionCard
					icon={
						<BiListPlus className="text-text" size={40} aria-hidden={true} />
					}
					title="Manage tailnet words"
					subtitle="Search for specific tailnet names with keywords"
					onClick={onShowWords}
				/>

				<ActionCard
					icon={
						<BiSolidKey className="text-text" size={40} aria-hidden={true} />
					}
					title={`View tailnet offers ${tokens && tokens.length > 0 ? `(${tokens.length})` : ''}`}
					subtitle="Claim offers to use as custom tailnet names"
					onClick={onShowTokens}
				/>
			</div>
		</div>
	</main>
);

export default MainScreen;
