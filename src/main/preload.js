const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	on: (channel, callback) => {
		const validChannels = ['fatal-error', 'update-status']; // whitelisted channels

		if (validChannels.includes(channel)) {
			ipcRenderer.on(channel, (_event, ...args) => callback(...args));
		}
	},
	removeListener: (channel, callback) => {
		ipcRenderer.removeListener(channel, callback);
	},
	quitApp: () => ipcRenderer.invoke('quit-app'),
	getInterval: () => ipcRenderer.invoke('get-interval'),
	setInterval: (min) => ipcRenderer.invoke('set-interval', min),
	submitWorklog: (data) => ipcRenderer.invoke('submit-worklog', data),
	saveCredentials: (data) => ipcRenderer.invoke('save-credentials', data),
	loadCredentials: () => ipcRenderer.invoke('load-credentials'),
	validateJira: (creds) => ipcRenderer.invoke('validate-jira', creds),
	validateTempo: (token) => ipcRenderer.invoke('validate-tempo', token),
	getAppVersion: () => ipcRenderer.invoke('get-app-version'),
	getStartup: () => ipcRenderer.invoke('get-startup'),
	setStartup: (shouldStart) => ipcRenderer.invoke('set-startup', shouldStart),
	restartApp: () => ipcRenderer.invoke('restart-app'),
});
