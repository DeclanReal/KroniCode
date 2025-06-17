import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadCredentials } from './credentials.js';
import { getIsQuitting } from './simpleStates.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

let popupWindow = null;

function createMainWindow(route = '/popup') {
	const startUrl = isDev
		? `http://localhost:5173/#${route}`
		: `file://${path.join(__dirname, '../../dist/index.html')}#${route}`;

	if (popupWindow && !popupWindow.isDestroyed()) {
		popupWindow.loadURL(startUrl);
		popupWindow.show();
		popupWindow.focus();
		return;
	}

	popupWindow = new BrowserWindow({
		width: 535,
		height: 600,
		alwaysOnTop: false,
		webPreferences: {
			preload: path.join(__dirname, '../preload.js'),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	popupWindow.loadURL(startUrl);
	if (isDev) popupWindow.webContents.openDevTools();

	popupWindow.on('close', (event) => {
		if (!getIsQuitting()) {
			event.preventDefault();
			popupWindow.hide();
		}
	});
}

async function showAndNavigateTo(route = '/popup') {
	const { setupComplete } = await loadCredentials();

	if (!setupComplete && route !== '/wizard') {
		console.warn('Redirecting to wizard setup');
		route = '/wizard';
	}

	if (popupWindow?.isDestroyed()) {
		popupWindow = null;
		createMainWindow(route);
	} else {
		if (popupWindow.isMinimized()) popupWindow.restore();
		popupWindow.show();
		popupWindow.focus();

		const startUrl = isDev
			? `http://localhost:5173/#${route}`
			: `file://${path.join(__dirname, '../../dist/index.html')}#${route}`;

		popupWindow.loadURL(startUrl);
	}
}

export { createMainWindow, showAndNavigateTo };
