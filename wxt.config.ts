import { resolve } from 'node:path';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
	manifest: {
		name: 'tailname',
		description: 'Search for custom tailnet name offers with keywords.',
		version: '1.0',
		permissions: [
			'cookies',
			'alarms',
			'storage',
			'notifications',
			'scripting',
			'tabs',
		],
		host_permissions: ['https://login.tailscale.com/*'],
		incognito: import.meta.env.CHROME ? 'split' : 'spanning',
		browser_specific_settings: {
			gecko: {
				id: 'tailname@sapphic.moe',
			},
		},
	},
	alias: {
		$background: resolve('entrypoints/background'),
		$components: resolve('entrypoints/popup/components'),
		$config: resolve('config.ts'),
		$handlers: resolve('handlers'),
		$helpers: resolve('helpers'),
		$hooks: resolve('entrypoints/popup/hooks'),
		$popup: resolve('entrypoints/popup'),
		$screens: resolve('entrypoints/popup/screens'),
		$types: resolve('types'),
	},
});
