import { WorkLogItem } from '../../renderer/classes/WorkLogItem.js';

async function submitWorklog(data, JiraAPI, TempoAPI) {
	const { ticket, startTime, duration, description } = data;

	// 1. Get Jira user account ID
	const userRes = await JiraAPI.get('/rest/api/3/myself');
	const authorAccountId = userRes.data.accountId;

	// 2. Get Jira issue ID
	const issueRes = await JiraAPI.get(`/rest/api/3/issue/${ticket}`);
	const issueId = issueRes.data.id;

	// 3. Build and submit
	const [date, time] = startTime.split('T');
	const workItem = new WorkLogItem(authorAccountId, description, issueId, date, time + ':00', duration);

	await TempoAPI.post('/worklogs', workItem);
}

export { submitWorklog };
