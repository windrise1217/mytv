import type { FC } from 'react';
import { BiArrowBack, BiInfoCircle, BiListPlus } from 'react-icons/bi';
import HelperText from '$components/HelperText';
import TailnetInput from '$components/TailnetInput';
import TailnetList from '$components/TailnetList';

interface TailnetWordsScreenProps {
	tailnetNames: string[];
	handleAddTailnet: () => void;
	handleRemoveTailnet: (name: string) => void;
	inputValue: string;
	setInputValue: (val: string) => void;
	isInputValid: boolean;
	loading: boolean;
	onBack: () => void;
	error: string | null;
	tails: string[];
	scales: string[];
	onShowWordList: () => void;
}

const TailnetWordsScreen: FC<TailnetWordsScreenProps> = ({
	tailnetNames,
	handleAddTailnet,
	handleRemoveTailnet,
	inputValue,
	setInputValue,
	isInputValid,
	loading,
	onBack,
	error,
	tails,
	scales,
	onShowWordList,
}) => (
	<main className="rounded-none shadow-lg p-6 w-full h-full">
		<div className="flex justify-between mb-4 items-center">
			<button
				className="text-sm px-3 py-2 rounded-lg flex flex-row items-center bg-item border border-border text-text font-medium hover:bg-accent transition-colors hover:border-accent"
				type="button"
				onClick={onBack}
			>
				<BiArrowBack
					className="inline-block mr-1"
					size={20}
					aria-hidden={true}
				/>
				Back
			</button>

			<h2 className="text-2xl flex flex-row gap-2 font-semibold text-center text-text">
				<BiListPlus className="text-text" size={35} aria-hidden={true} />
				Manage tailnet words
			</h2>
		</div>

		<div className="pb-4">
			<TailnetInput
				handleAddTailnet={handleAddTailnet}
				inputValue={inputValue}
				isInputValid={isInputValid}
				loading={loading}
				setInputValue={setInputValue}
				tailnetNames={tailnetNames}
				tails={tails}
				scales={scales}
			/>
			<div className="w-full text-center border border-border flex flex-row gap-2 justify-center text-text bg-item text-sm rounded-md mt-3 py-3 items-center">
				<BiInfoCircle className="inline-block" size={20} aria-hidden={true} />
				It's recommended to add multiple tailnet words to get tailnet offers
				faster.
			</div>
			<HelperText onShowWordList={onShowWordList} />
			<TailnetList
				handleRemoveTailnet={handleRemoveTailnet}
				tailnetNames={tailnetNames}
			/>
			{error && <div className="text-danger mt-2">{error}</div>}
		</div>
	</main>
);

export default TailnetWordsScreen;
