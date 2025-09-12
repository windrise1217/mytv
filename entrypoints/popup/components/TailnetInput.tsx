import { type FC, useId } from 'react';
import { BiPlus } from 'react-icons/bi';

interface TailnetInputProps {
	inputValue: string;
	setInputValue: (val: string) => void;
	isInputValid: string | boolean;
	handleAddTailnet: () => void;
	tails: string[];
	scales: string[];
	tailnetNames: string[];
	loading: boolean;
}

const TailnetInput: FC<TailnetInputProps> = ({
	inputValue,
	setInputValue,
	isInputValid,
	handleAddTailnet,
	tails,
	scales,
	tailnetNames,
	loading,
}) => {
	const datalistId = useId();

	const words = [...tails, ...scales];

	let comboSuggestions: string[] = [];
	if (inputValue.includes('-')) {
		const [tailPrefix, scalePrefix] = inputValue.split('-');
		comboSuggestions = tails
			.filter((tail) => tail.startsWith(tailPrefix))
			.flatMap((tail) =>
				scales
					.filter((scale) => scale.startsWith(scalePrefix || ''))
					.map((scale) => `${tail}-${scale}`),
			)
			.filter((combo) => !tailnetNames.includes(combo));
	}

	const isWordUsed = (word: string) =>
		tailnetNames.some(
			(name) =>
				name === word ||
				name.split('-')[0] === word ||
				name.split('-')[1] === word,
		);

	const singleWordSuggestions =
		!inputValue.includes('-') && inputValue.length > 0
			? Array.from(
					new Set(
						words.filter(
							(word) => !isWordUsed(word) && word.startsWith(inputValue),
						),
					),
				)
			: [];

	return (
		<div className="flex flex-col mb-2">
			<div className="flex flex-row w-full gap-2">
				<input
					type="text"
					className="w-full border border-border rounded-lg px-3 py-1.5 bg-input text-base text-text focus:border-accent focus:outline-none disabled:cursor-not-allowed"
					placeholder="Enter a tailnet word (bunny) or combo (miku-kitchen)..."
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !!isInputValid) {
							handleAddTailnet();
						}
					}}
					list={datalistId}
					disabled={loading}
				/>

				<button
					className="flex flex-row items-center px-3 gap-1 rounded-lg bg-accent text-text font-medium disabled:opacity-50 hover:opacity-80 disabled:cursor-not-allowed"
					type="button"
					onClick={handleAddTailnet}
					disabled={!isInputValid || isInputValid === ''}
				>
					<BiPlus className="inline-block" size={20} aria-hidden={true} />
					Add
				</button>
			</div>

			<datalist id={datalistId}>
				{singleWordSuggestions.map((word: string) => (
					<option key={word} value={word} />
				))}

				{comboSuggestions.map((combo) => (
					<option key={combo} value={combo} />
				))}
			</datalist>

			{inputValue.includes('-') && comboSuggestions.length === 0 && (
				<div className="w-full text-center border border-border text-text bg-item rounded-md mt-3 py-4 items-center font-medium">
					<p>⚠️ No valid combos found for your input.</p>

					<p>
						The combo must match the format of &lt;tail&gt;-&lt;scale&gt; (e.g.
						miku-kitchen).
					</p>
				</div>
			)}

			{!inputValue.includes('-') &&
				inputValue.length > 0 &&
				singleWordSuggestions.length === 0 && (
					<div className="w-full text-center border border-border text-text bg-item rounded-md mt-3 py-4 items-center font-medium ">
						<p>⚠️ No valid single words were found for your input.</p>

						<p>
							Either the matching words have already been added or they do not
							exist.
						</p>
					</div>
				)}
		</div>
	);
};

export default TailnetInput;
