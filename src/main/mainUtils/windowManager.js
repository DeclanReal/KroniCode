import { app, BrowserWindow } from 'electron';
import path from 'path';
import { loadCredentials } from './credentials.js';
import { getIsQuitting } from './simpleStates.js';
import isDev from 'electron-is-dev';
import setupAutoUpdater from '../autoUpdaterHandler.js';

const appPath = app.getAppPath();

let popupWindow = null;

function createMainWindow(route = '/popup') {
	const startUrl = isDev
		? `http://localhost:5173/#${route}`
		: `file://${path.join(appPath, 'dist', 'index.html')}#${route}`;

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
		icon: path.join(appPath, '/public/kronicode_icon.ico'),
		webPreferences: {
			preload: path.join(appPath, 'src', 'main', 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	popupWindow.loadURL(startUrl);
	if (isDev) popupWindow.webContents.openDevTools();

	// Wait for UI to finish loading before starting the updater
	popupWindow.webContents.once('did-finish-load', () => {
		console.log('UI loaded, starting auto updater...');
		setupAutoUpdater();
	});

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
			: `file://${path.join(appPath, 'dist', 'index.html')}#${route}`;

		popupWindow.loadURL(startUrl);
	}
}

function getMainWindow() {
	return popupWindow;
}

export { createMainWindow, showAndNavigateTo, getMainWindow };
