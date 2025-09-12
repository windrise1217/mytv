import type { FC } from 'react';

const HeaderSection: FC = () => (
	<section className="header text-2xl font-semibold text-center mb-2 text-text select-none">
		<img
			src={browser.runtime.getURL('/icons/128.png')}
			alt="Tailscale Logo"
			className="inline-block w-8 h-8 mr-2"
		/>
		tailname
	</section>
);

export default HeaderSection;
