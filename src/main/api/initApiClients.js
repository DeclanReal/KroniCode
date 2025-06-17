import { createApiClients } from './clients.js';

let JiraAPI = null;
let TempoAPI = null;

async function initApiClients({ jiraDomain, jiraEmail, jiraToken, tempoToken }) {
	({ JiraAPI, TempoAPI } = await createApiClients({ jiraDomain, jiraEmail, jiraToken, tempoToken }));
}

export { JiraAPI, TempoAPI, initApiClients };
