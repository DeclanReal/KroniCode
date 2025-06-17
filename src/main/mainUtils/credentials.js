import keytar from 'keytar';

const SERVICE_NAME = 'KroniCode';

export async function loadCredentials() {
	const jiraDomain = await keytar.getPassword(SERVICE_NAME, 'jiraDomain');
	const jiraEmail = await keytar.getPassword(SERVICE_NAME, 'jiraEmail');
	const jiraToken = await keytar.getPassword(SERVICE_NAME, 'jiraToken');
	const tempoToken = await keytar.getPassword(SERVICE_NAME, 'tempoToken');
	const setupComplete = await keytar.getPassword(SERVICE_NAME, 'setupComplete');
	const credentialsRetrieved = setupComplete && jiraDomain && jiraEmail && jiraToken && tempoToken;

	return { setupComplete, credentialsRetrieved, jiraDomain, jiraEmail, jiraToken, tempoToken };
}

export async function saveCredentials({ jiraDomain, jiraEmail, jiraToken, tempoToken }) {
	await keytar.setPassword(SERVICE_NAME, 'jiraDomain', jiraDomain);
	await keytar.setPassword(SERVICE_NAME, 'jiraEmail', jiraEmail);
	await keytar.setPassword(SERVICE_NAME, 'jiraToken', jiraToken);
	await keytar.setPassword(SERVICE_NAME, 'tempoToken', tempoToken);
	await keytar.setPassword(SERVICE_NAME, 'setupComplete', 'true');

	return true;
}