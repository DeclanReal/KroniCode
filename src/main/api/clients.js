import axios from 'axios';

/**
 * Creates Jira and Tempo Axios clients from provided credentials
 */
export function createApiClients({ jiraDomain, jiraEmail, jiraToken, tempoToken }) {
	if (!jiraEmail || !jiraToken || !tempoToken || !jiraDomain) {
		throw new Error('Missing Jira or Tempo credentials');
	}

	const jiraHeaders = {
		Authorization: `Basic ${Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64')}`,
		'Content-Type': 'application/json',
	};

	const tempoHeaders = {
		Authorization: `Bearer ${tempoToken}`,
		'Content-Type': 'application/json',
	};

	const JiraAPI = axios.create({
		baseURL: `https://${jiraDomain}`,
		headers: jiraHeaders,
	});

	const TempoAPI = axios.create({
		baseURL: 'https://api.tempo.io/4',
		headers: tempoHeaders,
	});

	attachRetryInterceptor(JiraAPI);
	attachRetryInterceptor(TempoAPI);

	return { JiraAPI, TempoAPI };
}

export function attachRetryInterceptor(instance, maxRetries = 3, delayMs = 1000) {
	instance.interceptors.response.use(
		res => res,
		async err => {
			const config = err.config;
			if (!config || config.__retryCount >= maxRetries) {
				return Promise.reject(err);
			}

			config.__retryCount = (config.__retryCount || 0) + 1;
			console.warn(`[Retry] Attempt ${config.__retryCount} for ${config.url}`);
			await new Promise(resolve => setTimeout(resolve, delayMs));
			return instance(config);
		}
	);
}
