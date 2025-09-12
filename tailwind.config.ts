import type { Config } from 'tailwindcss';

export default {
	content: ['./entrypoints/popup/**/*.{js,ts,jsx,tsx}'],
	theme: {
		colors: {
			accent: 'rgb(63, 93, 179)',
			background: 'rgb(31, 30, 30)',
			border: 'rgb(68, 67, 66)',
			header: 'rgba(24, 23, 23)',
			input: 'rgb(31, 30, 30)',
			item: 'rgb(46, 45, 45)',
			subtext: 'rgb(175, 172, 171)',
			text: 'rgb(247, 245, 244)',

			warning: 'rgb(229, 153, 62)',
			danger: '#ef4444',
			success: 'rgb(30, 166, 114)',

			pink: '#f5c2e7',
		},
		extend: {
			animation: {
				'spin-fast': 'spin 1s linear infinite',
			},
			keyframes: {
				spin: {
					to: { transform: 'rotate(360deg)' },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
