async function fetchBoardKeys(JiraAPI) {
	let startAt = 0;
	const maxResults = 50;
	let allProjects = [];
	let isLast = false;

	// jira's api caps results at 50 results, run multiple requests till isLast is true
	while (!isLast) {
		const res = await JiraAPI.get('/rest/api/3/project/search', {
			params: { startAt, maxResults },
		});

		const data = res.data;
		allProjects = [...allProjects, ...data.values];

		isLast = data.isLast || data.values.length < maxResults;
		startAt += maxResults;
	}

	return allProjects;
}

export { fetchBoardKeys };
