import axios from 'axios';
import { app, ipcMain } from 'electron';
import { submitWorklog } from './worklogHandler.js';
import { loadCredentials } from './credentials.js';
import { store } from '../storeConfig.js';
import { attachRetryInterceptor } from '../api/clients.js';
import { setIsQuitting } from './simpleStates.js';
import { fetchThisWeeksWorklogs } from './fetchThisWeeksWorklogs.js';
import { fetchBoardKeys } from './fetchBoardKeys.js';

function registerIpcHandlers(JiraAPI, TempoAPI, reminderInterval, setReminderTimerFn) {
	ipcMain.removeHandler('quit-app');
	ipcMain.removeHandler('restart-app');
	ipcMain.removeHandler('get-app-version');
	ipcMain.removeHandler('get-startup');
	ipcMain.removeHandler('set-startup');
	ipcMain.removeHandler('fetch-board-keys');
	ipcMain.removeHandler('submit-worklog');
	ipcMain.removeHandler('fetch-this-weeks-work-logs');
	ipcMain.removeHandler('add-to-recent-tickets');
	ipcMain.removeHandler('get-recent-tickets');
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

	ipcMain.handle('fetch-this-weeks-work-logs', async (_) => {
		const result = await fetchThisWeeksWorklogs(JiraAPI, TempoAPI);

		return result;
	});

	ipcMain.handle('add-to-recent-tickets', async (_, ticketToAdd) => {
		const existing = store.get('recentTickets', []);
		// move to front if exists, take 5 most recent
		const updated = [ticketToAdd, ...existing.filter(ticket =>
			`${ticket.boardKey}-${ticket.number}` !== `${ticketToAdd.boardKey}-${ticketToAdd.number}`
		)].slice(0, 5);

		store.set('recentTickets', updated);
	});

	ipcMain.handle('get-recent-tickets', async () => {
		return store.get('recentTickets');
	});

	ipcMain.handle('fetch-board-keys', async () => {
		const result = await fetchBoardKeys(JiraAPI);

		return result;
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
