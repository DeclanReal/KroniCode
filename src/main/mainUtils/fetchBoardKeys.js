async function fetchBoardKeys(JiraAPI) {
	// 1. Get Jira Projects
	const res = await JiraAPI.get('/rest/api/3/project/search');

	return res.data;
}

export { fetchBoardKeys };
