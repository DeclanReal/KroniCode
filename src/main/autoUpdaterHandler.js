import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import { dialog } from 'electron';
import { store } from './storeConfig.js';

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
		console.log('[Updater] Checking for update...');
	});

	autoUpdater.on('update-available', () => {
		console.log('[Updater] Update available — downloading...');
	});

	autoUpdater.on('update-not-available', () => {
		console.log('[Updater] No updates found.');
	});

	autoUpdater.on('error', (err) => {
		console.error('[Updater] Error during update check:', err);
	});

	autoUpdater.on('download-progress', (progressObj) => {
		const percent = Math.round(progressObj.percent);
		console.log(`[Updater] Download progress: ${percent}%`);
	});

	autoUpdater.on('update-downloaded', () => {
		console.log('[Updater] Update downloaded.');

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

export default setupAutoUpdater;
