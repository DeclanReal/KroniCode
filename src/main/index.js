import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { parseDuration } from '../utils/functions.js';
import { WorkLogItem } from '../renderer/classes/WorkLogItem.js';
import { JiraAPI, TempoAPI } from './api/clients.js';

dotenv.config();

const isDev = !app.isPackaged;
const SERVICE_NAME = 'KroniCode';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let popupWindow = null;
let tray = null;

// === WINDOW SETUP ===
function createPopupWindow() {
	if (popupWindow) {
		popupWindow.focus();
		return;
	}

	popupWindow = new BrowserWindow({
		width: 400,
		height: 600,
		alwaysOnTop: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	const popupUrl = isDev
		? 'http://localhost:5173/#/popup'
		: `file://${path.join(__dirname, '../../dist/index.html')}#/popup`;

	popupWindow.loadURL(popupUrl);

	if (isDev) popupWindow.webContents.openDevTools();

	popupWindow.on('closed', () => {
		popupWindow = null;
	});
}

// === TRAY SETUP ===
function setupTray() {
	tray = new Tray(path.join(__dirname, '../../public/icon.png'));
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Log Time Now', click: createPopupWindow },
		{ type: 'separator' },
		{ label: 'Quit', role: 'quit' },
	]);

	tray.setToolTip('KroniCode - Tempo Logger');
	tray.setContextMenu(contextMenu);
}

// === WORKLOG HANDLER ===
async function submitWorklog(data) {
	try {
		const { ticket, startTime, duration, description } = data;

		// 1. Get Jira user account ID
		const userRes = await JiraAPI.get('/rest/api/3/myself');
		const authorAccountId = userRes.data.accountId;

		// 2. Get Jira issue ID
		const issueRes = await JiraAPI.get(`/rest/api/3/issue/${ticket}`);
		const issueId = issueRes.data.id;

		// 3. Construct worklog data
		let [date, time] = startTime.split('T');
		time += ':00'; // Format to "HH:mm:00"

		const workItem = new WorkLogItem(authorAccountId, description, issueId, date, time, duration);

		// 4. Submit to Tempo
		await TempoAPI.post('/worklogs', workItem);

		console.log('✅ Worklog successfully submitted');
	} catch (err) {
		console.error('❌ Error submitting worklog:', err.response?.data || err.message);
	}
}

// === IPC HOOK ===
ipcMain.handle('submit-worklog', async (_event, data) => {
	await submitWorklog(data);
});

// === APP READY ===
app.whenReady().then(() => {
	createPopupWindow();
	setupTray();
});
