const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	getInterval: () => ipcRenderer.invoke('get-interval'),
	setInterval: (min) => ipcRenderer.invoke('set-interval', min),
	submitWorklog: (data) => ipcRenderer.invoke('submit-worklog', data),
	saveCredentials: (data) => ipcRenderer.invoke('save-credentials', data),
	loadCredentials: () => ipcRenderer.invoke('load-credentials'),
	validateJira: (creds) => ipcRenderer.invoke('validate-jira', creds),
	validateTempo: (token) => ipcRenderer.invoke('validate-tempo', token),
});
