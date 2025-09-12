import type { FC, ReactNode } from 'react';

interface ActionCardProps {
	icon: ReactNode;
	title: string;
	subtitle: string;
	onClick: () => void;
}

const ActionCard: FC<ActionCardProps> = ({
	icon,
	title,
	subtitle,
	onClick,
}) => (
	<button
		className="bg-header shadow-lg rounded-xl p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform border border-border w-full mx-auto"
		type="button"
		onClick={onClick}
	>
		<span className="text-2xl mb-2">{icon}</span>
		<span className="text-base font-semibold mb-1 text-text">{title}</span>
		<span className="text-subtext text-sm">{subtitle}</span>
	</button>
);

export default ActionCard;
