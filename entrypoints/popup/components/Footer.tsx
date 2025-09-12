import { useState } from 'react';
import { BiSolidHeart } from 'react-icons/bi';
import FAQModal from './FAQModal';

const Footer = () => {
	const [showFAQ, setShowFAQ] = useState(false);
	return (
		<footer className="flex items-center justify-between p-2 px-4 bg-header border-t-2 border-border text-subtext">
			<p className="flex flex-row gap-1 text-sm items-center">
				<BiSolidHeart size={20} className="fill-pink" aria-hidden={true} />{' '}
				<span className="text-text">tailname</span> is made by{' '}
				<a
					href="https://sapphic.moe"
					className="text-pink hover:underline hover:opacity-80"
					target="_blank"
					rel="noopener"
				>
					Chloe Arciniega
				</a>
			</p>

			<div className="flex flex-row gap-2">
				<button
					className="bg-item border border-border text-text font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-accent hover:border-accent hover:text-text transition-colors"
					onClick={() => setShowFAQ(true)}
					type="button"
				>
					FAQ
				</button>
				<a
					className="bg-item border border-border text-text font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-accent hover:text-text hover:border-accent transition-colors"
					href="https://ko-fi.com/solelychloe"
					target="_blank"
					rel="noopener"
				>
					Donate
				</a>
				<a
					className="bg-item border border-border text-text font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-accent hover:border-accent hover:text-text transition-colors"
					href="https://github.com/SapphoSys/tailname"
					target="_blank"
					rel="noopener"
				>
					Source
				</a>
			</div>

			<FAQModal show={showFAQ} onClose={() => setShowFAQ(false)} />
		</footer>
	);
};

export default Footer;
