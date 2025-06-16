import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { WorkLogItem } from '../renderer/classes/WorkLogItem.js';
import { JiraAPI, TempoAPI } from './api/clients.js';

dotenv.config();

const isDev = !app.isPackaged;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let popupWindow = null;
let tray = null;
let reminderInterval = 15 * 60 * 1000;
let reminderTimer = setInterval(createMainWindow, reminderInterval);
let isQuitting = false;

// === WINDOW SETUP ===
function createMainWindow(route = '/popup') {
	if (popupWindow && !popupWindow.isDestroyed()) {
		popupWindow.show();
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

	const startUrl = isDev
		? 'http://localhost:5173/#/popup'
		: `file://${path.join(__dirname, '../../dist/index.html')}#/${route}`;

	popupWindow.loadURL(startUrl);

	if (isDev) popupWindow.webContents.openDevTools();

	popupWindow.on('close', (event) => {
		if (!isQuitting) {
			event.preventDefault();
			popupWindow.hide(); // instead of closing, hide window
		}
	});
}

function showAndNavigateTo(route = '/popup') {
	if (popupWindow?.isDestroyed()) {
		popupWindow = null;
		createMainWindow(route);
	} else {
		if (popupWindow.isMinimized()) popupWindow.restore();
		popupWindow.show();
		popupWindow.focus();
		popupWindow.loadURL(
			isDev
				? `http://localhost:5173/#${route}`
				: `file://${path.join(__dirname, '../../dist/index.html')}#${route}`
		);
	}
}

// === TRAY SETUP ===
function setupTray() {
	tray = new Tray(path.join(__dirname, '../../public/icon.png'));

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Show App',
			click: () => {
				showAndNavigateTo('/popup');
			}
		},
		{ label: 'Log Time Now', click: () => showAndNavigateTo('/popup'), },
		{ label: 'Settings', click: () => showAndNavigateTo('/settings'), },
		{ type: 'separator' },
		{
			label: 'Quit', click: () => {
				isQuitting = true;
				app.quit();
			}
		},
	]);

	tray.on('click', () => {
		showAndNavigateTo('/popup');
	});

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

ipcMain.handle('get-interval', () => reminderInterval / 60000);
ipcMain.handle('set-interval', (_, minutes) => {
	reminderInterval = minutes * 60 * 1000;
	clearInterval(reminderTimer);
	reminderTimer = setInterval(createMainWindow, reminderInterval);
});

// === APP READY ===
app.whenReady().then(() => {
	createMainWindow();
	setupTray();
});

app.on('window-all-closed', () => {
	// Prevent app from quitting when all windows are closed (on Windows/Linux)
	if (process.platform !== 'darwin') {
		// Don't quit the app
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});
