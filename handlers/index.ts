import { handleGetNextAlarm, handleSetAlarmInterval } from '$handlers/alarm';
import { handleCheckEligibility } from '$handlers/eligibility';
import {
	handleGetStatus,
	handleStartCheck,
	handleStopCheck,
} from '$handlers/status';
import { handleClaimToken } from '$handlers/token';
import type { Message } from '$types/messages';

const handlers: Record<
	string,
	(message: Message, sendResponse: (resp: unknown) => void) => void
> = {
	checkEligibility: handleCheckEligibility,
	claimToken: handleClaimToken,
	getNextAlarm: handleGetNextAlarm,
	getStatus: handleGetStatus,
	setAlarmInterval: handleSetAlarmInterval,
	startCheck: handleStartCheck,
	stopCheck: handleStopCheck,
};

export default handlers;
