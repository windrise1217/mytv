import { type FC, useState } from 'react';
import { BiArrowBack, BiTable } from 'react-icons/bi';

interface WordListScreenProps {
	tails: string[];
	scales: string[];
	onBack: () => void;
}

const WordListScreen: FC<WordListScreenProps> = ({ tails, scales, onBack }) => {
	const [search, setSearch] = useState('');

	const sortedTails = [...tails].sort((a, b) => a.localeCompare(b));
	const sortedScales = [...scales].sort((a, b) => a.localeCompare(b));

	const filteredTails = sortedTails.filter((word) =>
		word.toLowerCase().includes(search.toLowerCase()),
	);
	const filteredScales = sortedScales.filter((word) =>
		word.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<main className="rounded-none shadow-lg p-6 w-full h-full flex flex-col">
			<div className="flex justify-between items-center mb-3">
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
					<BiTable size={35} aria-hidden={true} />
					Tailnet name word list
				</h2>
			</div>

			<input
				type="text"
				className="w-full border border-border rounded-lg px-3 py-1.5 mb-4 bg-input text-base text-text focus:border-accent focus:outline-none transition-colors"
				placeholder="Search for a word..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<div className="flex-1 overflow-y-auto border border-border rounded-lg bg-header p-4 [&::-webkit-scrollbar]:[width:0.5em] [&::-webkit-scrollbar-thumb]:bg-subtext">
				<div className="flex gap-6">
					<div className="flex-1">
						<h3 className="text-lg font-bold mb-2 text-text">Tails</h3>
						{filteredTails.length > 0 ? (
							<ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
								{filteredTails.map((word) => (
									<li
										key={word}
										className="text-text bg-item rounded px-2 py-1 text-base font-medium border border-border transition-colors"
									>
										{word}
									</li>
								))}
							</ul>
						) : (
							<div className="text-subtext text-sm mb-4">
								No tails words found.
							</div>
						)}
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-bold mb-2 text-text">Scales</h3>
						{filteredScales.length > 0 ? (
							<ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
								{filteredScales.map((word) => (
									<li
										key={word}
										className="text-text bg-item rounded px-2 py-1 text-base font-medium border border-border transition-colors"
									>
										{word}
									</li>
								))}
							</ul>
						) : (
							<div className="text-subtext text-sm">No scales words found.</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
};

export default WordListScreen;
