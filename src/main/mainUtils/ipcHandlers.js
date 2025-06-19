import axios from 'axios';
import { app, ipcMain } from 'electron';
import { submitWorklog } from './worklogHandler.js';
import { loadCredentials } from './credentials.js';
import { store } from '../storeConfig.js';
import { attachRetryInterceptor } from '../api/clients.js';
import { setIsQuitting } from './simpleStates.js';

function registerIpcHandlers(JiraAPI, TempoAPI, reminderInterval, setReminderTimerFn) {
	ipcMain.removeHandler('quit-app');
	ipcMain.removeHandler('restart-app');
	ipcMain.removeHandler('get-app-version');
	ipcMain.removeHandler('get-startup');
	ipcMain.removeHandler('set-startup');
	ipcMain.removeHandler('submit-worklog');
	ipcMain.removeHandler('get-interval');
	ipcMain.removeHandler('set-interval');
	ipcMain.removeHandler('load-credentials');
	ipcMain.removeHandler('validate-jira');
	ipcMain.removeHandler('validate-tempo');

	ipcMain.handle('quit-app', async () => {
		setIsQuitting(true);
		app.quit();
	});

	ipcMain.handle("restart-app", () => {
		app.relaunch();
		app.exit(0);
	});

	ipcMain.handle('get-app-version', () => {
		return app.getVersion();
	});

	ipcMain.handle("get-startup", () => {
		return app.getLoginItemSettings().openAtLogin;
	});

	ipcMain.handle("set-startup", (_event, shouldStart) => {
		app.setLoginItemSettings({
			openAtLogin: shouldStart,
			path: process.execPath,
		});
	});

	ipcMain.handle('submit-worklog', async (_, data) => {
		await submitWorklog(data, JiraAPI, TempoAPI);
	});

	ipcMain.handle('get-interval', () => {
		// fallback to default if nothing saved yet
		return store.get('popupInterval', reminderInterval / 60000);
	});

	ipcMain.handle('set-interval', (_, minutes) => {
		reminderInterval = minutes * 60 * 1000;
		store.set('popupInterval', minutes);
		setReminderTimerFn(reminderInterval);
	});

	ipcMain.handle('load-credentials', loadCredentials);

	ipcMain.handle('validate-jira', async (_, { domain, email, token }) => {
		const instance = axios.create({
			baseURL: `https://${domain}/rest/api/3`,
			auth: {
				username: email,
				password: token,
			}
		});

		attachRetryInterceptor(instance);

		const res = await instance.get('/myself');

		return !!res.data.accountId;
	});

	ipcMain.handle('validate-tempo', async (_, token) => {
		const instance = axios.create({
			baseURL: 'https://api.tempo.io/4',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		attachRetryInterceptor(instance);

		const res = await instance.get('/worklogs');

		return Array.isArray(res.data.results);
	});
}

export { registerIpcHandlers };
