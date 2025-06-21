import { Tray, Menu, app } from 'electron';
import path from 'path';
import { showAndNavigateTo } from './windowManager.js';
import { setIsQuitting } from './simpleStates.js';
import { loadCredentials } from './credentials.js';
import {
	pauseRemindersFor, pauseRemindersUntilEndOfDay, resumeReminders,
	isReminderPaused, getPauseState, externallyUpdateReminderState,
} from './pauseManager.js';

const appPath = app.getAppPath();
let tray = null;

async function setupTray() {
	const { credentialsRetrieved } = await loadCredentials();
	const pathToShow = credentialsRetrieved ? '/popup' : '/wizard';

	const contextMenu = buildTrayMenu(undefined, pathToShow);

	// If tray already exists, just update the menu
	if (tray) {
		tray.setContextMenu(contextMenu);
		return;
	}

	// Otherwise, create the tray
	const iconPath = app.isPackaged
		? path.join(appPath, 'dist/kronicode_icon_32x32.png')
		: path.join(appPath, 'public/kronicode_icon_32x32.png');

	tray = new Tray(iconPath);
	tray.setToolTip('KroniCode\nLast log: N/A');
	tray.setContextMenu(contextMenu);
	tray.on('click', () => showAndNavigateTo(pathToShow));
}

async function updateTray(lastLogTime) {
	if (!tray) return;

	const { credentialsRetrieved } = await loadCredentials();
	const pathToShow = credentialsRetrieved ? '/popup' : '/wizard';

	const pauseNote = isReminderPaused() ? ' (reminders paused)' : '';
	const formatted = lastLogTime ?? 'N/A';
	tray.setToolTip(`KroniCode\nLast log: ${formatted}${pauseNote}`);
	tray.setContextMenu(buildTrayMenu(formatted, pathToShow, pauseNote));
}

export { setupTray, updateTray, isReminderPaused };

function buildTrayMenu(lastLogTime = 'N/A', pathToShow = '*', pauseNote = '') {
	return Menu.buildFromTemplate([
		{ label: 'Log Time Now', click: () => showAndNavigateTo(pathToShow) },
		{ label: 'Settings', click: () => showAndNavigateTo(pathToShow === '/popup' ? 'settings' : '/wizard') },
		{ label: 'Run Setup Wizard', click: () => showAndNavigateTo('/wizard') },
		{
			label: 'Pause Reminders',
			submenu: [
				{
					label: 'For 15 minutes',
					click: () => {
						pauseRemindersFor(15);
						updateTray(lastLogTime);
					},
				},
				{
					label: 'For 1 hour',
					click: () => {
						pauseRemindersFor(60);
						updateTray(lastLogTime);
					},
				},
				{
					label: 'For the rest of the day',
					click: () => {
						pauseRemindersUntilEndOfDay();
						updateTray(lastLogTime);
					},
				},
				{
					label: 'Until I resume',
					type: 'checkbox',
					checked: getPauseState() === 'manual',
					click: (menuItem) => {
						externallyUpdateReminderState(menuItem.checked ? 'manual' : null);
						updateTray(lastLogTime);
					},
				},
			],
		},
		{
			label: 'Resume Reminders',
			enabled: getPauseState() !== null,
			click: () => {
				resumeReminders();
				updateTray(lastLogTime);
			},
		},
		{ type: 'separator' },
		{
			label: 'Quit', click: () => {
				setIsQuitting(true);
				setTimeout(() => app.quit(), 100); // Small delay to allow flag to register
			}
		},
		{ type: 'separator' },
		{ label: `🕒 Last log: ${lastLogTime}${pauseNote}`, enabled: false }
	]);
}
