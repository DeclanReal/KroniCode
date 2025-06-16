const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  submitWorklog: (data) => ipcRenderer.invoke('submit-worklog', data)
});
