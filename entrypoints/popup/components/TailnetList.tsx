import type { FC } from 'react';
import { BiX } from 'react-icons/bi';

interface TailnetListProps {
	tailnetNames: string[];
	handleRemoveTailnet: (name: string) => void;
}

const TailnetList: FC<TailnetListProps> = ({
	tailnetNames,
	handleRemoveTailnet,
}) => {
	if (tailnetNames.length === 0) return null;
	return (
		<div className="bg-header border border-border rounded-lg p-4 mt-4 max-h-[23em] overflow-y-auto [&::-webkit-scrollbar]:[width:0.5em] [&::-webkit-scrollbar-thumb]:bg-subtext">
			<div className="flex flex-wrap gap-2">
				{tailnetNames.map((name: string) => (
					<span
						key={name}
						className="flex items-center gap-2.5 bg-item text-text rounded-md px-3 py-1 text-base font-medium shadow-sm border border-border"
					>
						{name}
						<button
							className="text-lg text-subtext transition-colors hover:rounded-lg hover:bg-danger hover:text-text rounded-full flex"
							type="button"
							onClick={() => handleRemoveTailnet(name)}
							aria-label={`Remove ${name}`}
						>
							<BiX size={20} />
						</button>
					</span>
				))}
			</div>
		</div>
	);
};

export default TailnetList;
