import type { FC } from 'react';
import { BiArrowBack, BiSolidKey } from 'react-icons/bi';
import TokenList from '$components/TokenList';
import type { Token } from '$types/tokens';

interface TokenListScreenProps {
	tokens: Token[];
	handleClaimToken: (tokenObj: Token) => Promise<void>;
	handleRemoveToken: (tokenObj: Token) => void;
	loading: boolean;
	error: string | null;
	onBack: () => void;
}

const TokenListScreen: FC<TokenListScreenProps> = ({
	tokens,
	handleClaimToken,
	handleRemoveToken,
	loading,
	error,
	onBack,
}) => (
	<main className="rounded-none shadow-lg p-6 w-full h-full">
		<div className="flex justify-between items-center mb-4">
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

			<h2 className="text-2xl font-semibold gap-2 flex flex-row text-text">
				<BiSolidKey className="text-text" size={35} aria-hidden={true} />
				Tailnet name offers
			</h2>
		</div>

		<TokenList
			error={error}
			handleClaimToken={handleClaimToken}
			handleRemoveToken={handleRemoveToken}
			loading={loading}
			tokens={tokens}
		/>
	</main>
);

export default TokenListScreen;
