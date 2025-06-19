import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import { dialog } from 'electron';
import { store } from './storeConfig.js';
import { getMainWindow } from './mainUtils/windowManager.js';

function setupAutoUpdater() {
	autoUpdater.autoDownload = true;

	// If a previous update was downloaded but not installed
	if (store.get('updatePending')) {
		console.log('[Updater] Pending update detected. Installing...');
		store.delete('updatePending');
		autoUpdater.quitAndInstall();

		return;
	}

	autoUpdater.on('checking-for-update', () => {
		sendStatus('checking');
	});

	autoUpdater.on('update-available', () => {
		sendStatus('available');
	});

	autoUpdater.on('update-not-available', () => {
		sendStatus('not-available');
	});

	autoUpdater.on('error', (err) => {
		sendStatus('error', err);
	});

	autoUpdater.on('download-progress', (progressObj) => {
		const percent = Math.round(progressObj.percent);
		sendStatus(`progress`, percent);
	});

	autoUpdater.on('update-downloaded', () => {
		sendStatus('downloaded');

		dialog.showMessageBox({
			type: 'info',
			title: 'Update Ready',
			message: 'A new version has been downloaded. Restart KroniCode to install it now?',
			buttons: ['Restart Now', 'Later'],
			defaultId: 0,
			cancelId: 1
		}).then((result) => {
			if (result.response === 0) {
				autoUpdater.quitAndInstall();
			} else {
				// Enable install on next launch
				store.set('updatePending', true);
			}
		});
	});

	autoUpdater.checkForUpdates();
}

function sendStatus(status, data) {
	const win = getMainWindow();

	if (win && win.webContents) {
		win.webContents.send('update-status', { status, data });
	}
}

export default setupAutoUpdater;
