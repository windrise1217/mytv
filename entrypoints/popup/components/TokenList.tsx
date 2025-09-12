import type { FC } from 'react';
import { MdCheck, MdDelete, MdOutlineWarning } from 'react-icons/md';
import { extractTailnetNameFromToken } from '$helpers/tokens';
import type { Token } from '$types/tokens';

interface TokenListProps {
	tokens: Token[];
	handleClaimToken: (tokenObj: Token) => Promise<void>;
	handleRemoveToken: (tokenObj: Token) => void;
	loading: boolean;
	error: string | null;
}

const TokenList: FC<TokenListProps> = ({
	tokens,
	handleClaimToken,
	handleRemoveToken,
	loading,
	error,
}) => {
	return (
		<div>
			<div className="bg-item flex flex-row items-center gap-1 text-sm border-border border px-3 py-3 rounded-lg text-text mb-3">
				<MdOutlineWarning
					className="text-warning"
					size={20}
					aria-hidden={true}
				/>
				Each tailnet offer only last 5 minutes. Make sure to use them quickly!
			</div>

			<div className="bg-header border border-border text-text rounded-lg p-4 max-h-[25rem] overflow-y-auto [&::-webkit-scrollbar]:[width:0.5em] [&::-webkit-scrollbar-thumb]:bg-subtext">
				<ul className="flex flex-col gap-4">
					{tokens.length > 0 ? (
						tokens.map((tokenObj, idx) => {
							const expiresAt = tokenObj.timestamp
								? tokenObj.timestamp + 5 * 60 * 1000
								: null;
							const timeLeft = expiresAt ? expiresAt - Date.now() : null;
							let expireColor = 'bg-header border-border';
							if (timeLeft !== null) {
								if (timeLeft < 60 * 1000)
									expireColor = 'bg-danger border-danger';
								else if (timeLeft < 2 * 60 * 1000)
									expireColor = 'bg-warning text-header border-warning';
							}
							return (
								<li
									key={`${tokenObj.token}-${idx}`}
									className="flex flex-row items-center justify-between gap-4 px-3 py-2.5 rounded-lg border border-border bg-item"
								>
									<div className="flex flex-col gap-1">
										<span className="font-semibold text-base text-text truncate">
											{extractTailnetNameFromToken(tokenObj.token)}
										</span>

										{expiresAt &&
											(Date.now() > expiresAt ? (
												<span className="px-2 py-1 rounded-lg text-xs font-medium bg-danger text-text border border-danger w-fit">
													Token expired
												</span>
											) : (
												<span
													className={`px-2 py-1 rounded-lg text-xs font-medium ${expireColor} border w-fit`}
												>
													Expires at{' '}
													{new Date(expiresAt).toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
														second: '2-digit',
													})}
												</span>
											))}
									</div>
									<div className="flex flex-row gap-2 items-center">
										<button
											className={`px-3 py-2 rounded-lg bg-accent text-text text-sm font-semibold transition flex items-center gap-1 ${loading || Boolean(expiresAt && Date.now() > expiresAt) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 transition-opacity'}`}
											type="button"
											onClick={() => handleClaimToken(tokenObj)}
											disabled={
												loading || Boolean(expiresAt && Date.now() > expiresAt)
											}
											aria-label="Claim token"
										>
											<MdCheck size={20} />
											<span>Claim</span>
										</button>
										<button
											className="px-3 py-2 rounded-lg bg-danger text-text text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-1"
											type="button"
											onClick={() => handleRemoveToken(tokenObj)}
											disabled={loading}
											aria-label="Remove token"
										>
											<MdDelete size={20} />
											<span>Remove</span>
										</button>
									</div>
								</li>
							);
						})
					) : (
						<li className="text-subtext text-center py-4">
							No matching offers found yet.
						</li>
					)}
				</ul>
			</div>

			{error && <div className="text-danger mt-2">{error}</div>}
		</div>
	);
};

export default TokenList;
