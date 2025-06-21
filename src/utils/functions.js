export function parseDuration(duration) {
	const [hours, minutes] = duration.split(':').map(Number);
	return (hours * 60 + minutes) * 60;
}

export function getCurrentDateTime() {
	const now = new Date();
	now.setSeconds(0, 0); // strip seconds and ms

	const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000); // offset for UTC +2 South Africa TimeZone

	return offsetDate.toISOString().slice(0, 16);
}

export function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-based
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function getStartOfWeek(date) {
	const day = date.getDay(); // Sunday = 0, Monday = 1, ...
	const diff = (day === 0 ? -6 : 1 - day); // shift Sunday back to previous Monday
	const monday = new Date(date);
	monday.setDate(date.getDate() + diff);
	monday.setHours(0, 0, 0, 0);

	return monday;
}

export function getEndOfWeek(date) {
	const day = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
	const diffToFriday = (5 - day + 7) % 7;
	const sunday = new Date(date);
	sunday.setDate(date.getDate() + diffToFriday);
	sunday.setHours(23, 59, 59, 999);

	return sunday;
}

export function isSameDate(d1, d2) {
	return d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate();
}

export function formatSecondsAsTime(seconds) {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	return `${hrs}h ${mins}m`;
}

export function getTotalTimeSummary(worklogs, today = new Date()) {
	const totalToday = worklogs.reduce((sum, log) => {
		const logDate = new Date(log.startDate);

		if (isSameDate(logDate, today)) {
			sum += log.timeSpentSeconds;
		}

		return sum;
	}, 0);

	const weekStart = getStartOfWeek(today);
	const weekEnd = getEndOfWeek(today);

	const totalWeek = worklogs.reduce((sum, log) => {
		const logDate = new Date(log.startDate);

		if (logDate >= weekStart && logDate <= weekEnd) {
			sum += log.timeSpentSeconds;
		}
		
		return sum;
	}, 0);

	return {
		today: formatSecondsAsTime(totalToday),
		week: formatSecondsAsTime(totalWeek)
	};
}
