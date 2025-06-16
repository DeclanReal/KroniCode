import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Ensure env vars are loaded

const jiraDomain = process.env.JIRA_BASE_URL;
const jiraEmail = process.env.JIRA_EMAIL;
const jiraToken = process.env.JIRA_FULL_AUTH_TOKEN;
const tempoToken = process.env.TEMPO_AUTH_TOKEN;

// === If missing env variables, throw error ===
if (!jiraEmail || !jiraToken || !tempoToken) {
    throw new Error('Missing Jira or Tempo credentials in environment variables');
}

// === Create Headers ===
const jiraHeaders = {
    Authorization: `Basic ${Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64')}`,
    'Content-Type': 'application/json',
};

const tempoHeaders = {
    Authorization: `Bearer ${tempoToken}`,
    'Content-Type': 'application/json',
};

// === Retry Logic ===
function attachRetryInterceptor(instance, maxRetries = 3, delayMs = 1000) {
    instance.interceptors.response.use(
        res => res,
        async err => {
            const config = err.config;

            // Bail if no config or already retried too much
            if (!config || config.__retryCount >= maxRetries) {
                return Promise.reject(err);
            }

            config.__retryCount = (config.__retryCount || 0) + 1;

            console.warn(
                `[Retry] Attempt ${config.__retryCount} for ${config.url}`
            );

            await new Promise(resolve => setTimeout(resolve, delayMs));

            return instance(config); // retry request
        }
    );
}

// === Create Clients ===
export const JiraAPI = axios.create({
    baseURL: jiraDomain,
    headers: jiraHeaders,
});

export const TempoAPI = axios.create({
    baseURL: 'https://api.tempo.io/4',
    headers: tempoHeaders,
});

// === Attach Retry Interceptors ===
attachRetryInterceptor(JiraAPI);
attachRetryInterceptor(TempoAPI)