const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getInterval: () => ipcRenderer.invoke('get-interval'),
  setInterval: (min) => ipcRenderer.invoke('set-interval', min),
  submitWorklog: (data) => ipcRenderer.invoke('submit-worklog', data)
});
