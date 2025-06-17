// config.js
import ElectronStore from 'electron-store';

export const store = new ElectronStore({
	defaults: {
		popupInterval: 15 // default to 15 minutes
	}
});
