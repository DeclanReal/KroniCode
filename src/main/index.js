import { app, ipcMain } from 'electron';
import dotenv from 'dotenv';
import { createMainWindow } from './mainUtils/windowManager.js';
import { setupTray } from './mainUtils/tray.js';
import { registerIpcHandlers } from './mainUtils/ipcHandlers.js';
import { loadCredentials, saveCredentials } from './mainUtils/credentials.js';
import { store } from './storeConfig.js';
import { JiraAPI, TempoAPI, initApiClients } from './api/initApiClients.js';
import setupAutoUpdater from './autoUpdaterHandler.js';

dotenv.config();

let reminderInterval = 15 * 60 * 1000;
let reminderTimer = null;

process.on('unhandledRejection', err => {
	console.error('🛑 Unhandled Rejection:', err);
});

async function setReminderTimer(userReminderInterval) {
	if (reminderTimer) clearInterval(reminderTimer);
	const { credentialsRetrieved } = await loadCredentials();

	if (!credentialsRetrieved) return;

	reminderTimer = setInterval(() => createMainWindow('/popup'), userReminderInterval);
}

app.whenReady().then(async () => {
	const isFirstLaunch = !store.get('hasLaunchedBefore');

	if (isFirstLaunch) {
		store.set('hasLaunchedBefore', true);
	}

	setupAutoUpdater();

	const credentials = await loadCredentials();
	const savedMinutes = store.get('popupInterval');

	if (!credentials.credentialsRetrieved) {
		createMainWindow('/wizard');
	} else {
		const { jiraDomain, jiraEmail, jiraToken, tempoToken } = credentials;
		await initApiClients({ jiraDomain, jiraEmail, jiraToken, tempoToken });
		if (!JiraAPI || !TempoAPI) throw new Error('API Clients unavailable');
		createMainWindow('/popup');
	}

	if (savedMinutes) {
		reminderInterval = savedMinutes * 60 * 1000;
	}

	registerIpcHandlers(JiraAPI, TempoAPI, reminderInterval, setReminderTimer);
	setupTray();
	setReminderTimer(reminderInterval);
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') return; });
app.on('activate', () => createMainWindow());

// this is here for ease of context flow
// when a user saves their credentials -> fetch the new credentials, then re-initialize api clients
ipcMain.handle('save-credentials', async (_, creds) => {
	await saveCredentials(creds);

	// Re-load saved credentials
	const { jiraDomain, jiraEmail, jiraToken, tempoToken } = await loadCredentials();

	// Re-init API clients
	await initApiClients({ jiraDomain, jiraEmail, jiraToken, tempoToken });

	// Re-register IPC handlers (with updated clients)
	registerIpcHandlers(JiraAPI, TempoAPI, reminderInterval, setReminderTimer);
	setupTray();

	return { success: true };
});
