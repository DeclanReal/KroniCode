import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		// On mount, read from localStorage
		const saved = localStorage.getItem('darkMode');

		if (saved === 'true') {
			setDarkMode(true);
			document.documentElement.classList.add('dark');
		}
	}, []);

	function toggleDarkMode(forceValue) {
		const shouldEnable = forceValue !== undefined ? forceValue : !darkMode;

		if (shouldEnable) {
			document.documentElement.classList.add('dark');
			setDarkMode(true);
		} else {
			document.documentElement.classList.remove('dark');
			setDarkMode(false);
		}
	}

	return (
		<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
}

ThemeProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
