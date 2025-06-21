import { formatDate, getEndOfWeek, getStartOfWeek } from "../../utils/functions.js";

async function fetchThisWeeksWorklogs(JiraAPI, TempoAPI) {
	// 1. Get Jira user account ID
	const userRes = await JiraAPI.get('/rest/api/3/myself');
	const authorAccountId = userRes.data.accountId;

	// 2. Build and submit
	const today = new Date();
	const from = formatDate(getStartOfWeek(today));
	const to = formatDate(getEndOfWeek(today));

	const res = await TempoAPI.get(`/worklogs/user/${authorAccountId}?from=${from}&to=${to}`);

	return res.data;
}

export { fetchThisWeeksWorklogs };
