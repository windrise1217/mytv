import handlers from '$handlers';
import { log } from '$helpers/logging';
import type { Message } from '$types/messages';

export const setupMessaging = () => {
	browser.runtime.onMessage.addListener(
		(message: Message, _sender, sendResponse) => {
			const handler = handlers[message.action];
			if (handler) {
				handler(message, sendResponse);
				return true;
			}

			log(
				`No handler found for action: ${message.action}`,
				'WARNING',
				'Messaging',
			);

			return false;
		},
	);
};
