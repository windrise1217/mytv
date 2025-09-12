import type { FC } from 'react';
import { BiTable } from 'react-icons/bi';

interface HelperTextProps {
	onShowWordList: () => void;
}

const HelperText: FC<HelperTextProps> = ({ onShowWordList }) => {
	return (
		<button
			type="button"
			className="w-full text-center border border-accent flex flex-row gap-2 justify-center text-text bg-accent text-sm rounded-md mt-3 py-3 items-center font-medium hover:opacity-80 transition-opacity"
			onClick={onShowWordList}
		>
			<BiTable className="inline-block" size={20} aria-hidden={true} />
			View all available tailnet words
		</button>
	);
};

export default HelperText;
