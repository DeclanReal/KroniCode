import { Tray, Menu, app } from 'electron';
import path from 'path';
import { showAndNavigateTo } from './windowManager.js';
import { setIsQuitting } from './simpleStates.js';
import { loadCredentials } from './credentials.js';
import isDev from 'electron-is-dev';

const appPath = app.getAppPath();
let tray = null;
let authenticatedPath = '/wizard';

async function setupTray() {
	const { credentialsRetrieved } = await loadCredentials();

	if (credentialsRetrieved) authenticatedPath = '/popup';

	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Show App', click: () => showAndNavigateTo(authenticatedPath) },
		{ label: 'Log Time Now', click: () => showAndNavigateTo(authenticatedPath) },
		{ label: 'Settings', click: () => showAndNavigateTo(credentialsRetrieved ? '/settings' : 'wizard') },
		{ label: 'Run Setup Wizard', click: () => showAndNavigateTo('/wizard') },
		{ type: 'separator' },
		{
			label: 'Quit', click: () => {
				setIsQuitting(true);
				setTimeout(() => app.quit(), 100); // Small delay to allow flag to register
			}
		}
	]);

	// If tray already exists, just update the menu
	if (tray) {
		tray.setContextMenu(contextMenu);
		return;
	}

	// Otherwise, create the tray
	const iconPath = isDev
		? path.join(appPath, 'public/kronicode_icon_32x32.png')
		: path.join(appPath, 'dist/kronicode_icon_32x32.png');

	tray = new Tray(iconPath);
	tray.setToolTip('KroniCode - Tempo Logger');
	tray.setContextMenu(contextMenu);
	tray.on('click', () => showAndNavigateTo(authenticatedPath));
}

export { setupTray };
