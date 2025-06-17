import { Tray, Menu, app } from 'electron';
import path from 'path';
import { showAndNavigateTo } from './windowManager.js';
import { setIsQuitting } from './simpleStates.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadCredentials } from './credentials.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let tray = null;
let authenticatedPath = '/wizard';

async function setupTray() {
	tray = new Tray(path.join(__dirname, '../../../public/icon.png'));

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

	tray.setToolTip('KroniCode - Tempo Logger');
	tray.setContextMenu(contextMenu);
	tray.on('click', () => showAndNavigateTo(authenticatedPath));
}

export { setupTray };
