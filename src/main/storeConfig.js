import ElectronStore from 'electron-store';

export const store = new ElectronStore({
	defaults: {
		popupInterval: 15
	}
});
