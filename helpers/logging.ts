type LogSeverity = 'INFO' | 'WARNING' | 'DEBUG' | 'ERROR';
type LogCategory =
	| 'Alarms'
	| 'Notifications'
	| 'Cookies'
	| 'Tokens'
	| 'Eligibility'
	| 'Offers'
	| 'Storage'
	| 'Messaging'
	| 'Setup'
	| 'General';

const severityEmoji: Record<LogSeverity, string> = {
	INFO: 'ℹ️',
	WARNING: '⚠️',
	DEBUG: '🐛',
	ERROR: '❌',
};

export const log = (
	message: string,
	severity: LogSeverity = 'INFO',
	category: LogCategory = 'General',
) => {
	const timestamp = new Date().toLocaleTimeString();
	const emoji = severityEmoji[severity] || '';
	console.log(
		`${emoji} [${timestamp}] [${severity}] [${category}]: ${message}`,
	);
};
