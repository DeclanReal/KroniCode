import { app, BrowserWindow } from 'electron';
import path from 'path';
import { loadCredentials } from './credentials.js';
import { getIsQuitting } from './simpleStates.js';
import isDev from 'electron-is-dev';
import setupAutoUpdater from '../autoUpdaterHandler.js';

const appPath = app.getAppPath();

let popupWindow = null;
let splash = null;
let loaded = false;

function createMainWindow(route = '/popup') {
	const startUrl = isDev
		? `http://localhost:5173/#${route}`
		: `file://${path.join(appPath, 'dist', 'index.html')}#${route}`;

	const splashUrl = isDev
		? 'http://localhost:5173/#/splash'
		: `file://${path.join(appPath, 'dist', 'index.html')}#/splash`;

	if (!loaded) {
		splash = new BrowserWindow({
			width: 300,
			height: 150,
			frame: false,
			transparent: true,
			alwaysOnTop: true,
		});

		splash.loadURL(splashUrl);
	}

	if (popupWindow && !popupWindow.isDestroyed()) {
		popupWindow.loadURL(startUrl);
		popupWindow.show();
		popupWindow.focus();
		return;
	}

	popupWindow = new BrowserWindow({
		width: 600,
		height: 725,
		alwaysOnTop: false,
		show: false,
		focusable: false,
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
	// Display splash until UI is finished loading, then destroy splash and show main window
	popupWindow.webContents.once('did-finish-load', () => {
		loaded = true;
		popupWindow.setFocusable(true);

		if (splash) splash.destroy();

		popupWindow.show();
		popupWindow.focus();

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
