let remindersPausedUntil = null;

export function pauseRemindersFor(minutes) {
	remindersPausedUntil = new Date(Date.now() + minutes * 60 * 1000);
}

export function pauseRemindersUntilEndOfDay() {
	const now = new Date();
	now.setHours(23, 59, 59, 999);
	remindersPausedUntil = now;
}

export function resumeReminders() {
	remindersPausedUntil = null;
}

export function isReminderPaused() {
	if (!remindersPausedUntil) return false;
	if (remindersPausedUntil === 'manual') return true;
	return new Date() < new Date(remindersPausedUntil);
}

export function getPauseState() {
	return remindersPausedUntil;
}

export function externallyUpdateReminderState(newState) {
	remindersPausedUntil = newState;
}
