import './index.css';

import { ErrorBoundary } from './components/ErrorBoundary';

import { Routes, Route } from 'react-router-dom';
import IssueLoggerScreen from './pages/IssueLoggerScreen';
import SettingsScreen from './pages/SettingsScreen';
import SetupWizard from './setupWizard/SetupWizard';
import WhatsNewPage from './pages/WhatsNewPage';
import { useEffect, useState } from 'react';
import WhatsNewModal from './components/WhatsNewModal';
import ToastBanner from './components/ToastBanner';
import { ThemeProvider } from './components/ThemeContext';

function AppInsideErrorBoundary() {
	const [version, setVersion] = useState(null);
	const [fatalError, setFatalError] = useState(null);
	const [toast, setToast] = useState(null);

	function handleToastStatusChecking({ status, data }) {
		switch (status) {
			case "checking":
				setToast({ message: "🔍 Checking for updates...", type: "info" });
				break;
			case "available":
				setToast({ message: "⬇️ Update available. Downloading...", type: "info" });
				break;
			case "progress":
				setToast({ message: `📦 Downloading update: ${data}%`, type: "info", progress: data });
				break;
			case "downloaded":
				setToast({ message: "✅ Update downloaded", type: "success" });
				setTimeout(() => setToast(null), 4000);
				break;
			case "not-available":
				setToast({ message: "✅ You're on the latest version.", type: "success" });
				setTimeout(() => setToast(null), 3000);
				break;
			case "error":
				setToast({ message: `❌ Update failed: ${data}`, type: "error" });
				setTimeout(() => setToast(null), 4000);
				break;
			default:
				setToast(null);
		}
	}

	useEffect(() => {
		const handler = (message) => {
			setFatalError(new Error(message));
		};

		window.api.getAppVersion().then(setVersion);

		window.api.on("update-status", handleToastStatusChecking);

		// catch errors in main electron process and throw an error to trigger the error boundary
		window.api.on('fatal-error', handler);

		return () => {
			window.api.removeListener('fatal-error', handler);
			window.api.removeListener('update-status', handleToastStatusChecking);
		};
	}, []);

	if (fatalError) throw fatalError;

	if (!version) return null;

	return (
		<ThemeProvider>
			<ToastBanner
				message={toast?.message}
				visible={!!toast}
				type={toast?.type}
				progress={toast?.progress}
			/>
			<WhatsNewModal version={version} />

			<Routes>
				<Route path="/wizard" element={<SetupWizard />} />
				<Route path="/popup" element={<IssueLoggerScreen />} />
				<Route path="/settings" element={<SettingsScreen />} />
				<Route path="/whats-new" element={<WhatsNewPage version={version} />} />
				{/* Fallback route */}
				<Route path="*" element={<div>404 Not Found</div>} />
			</Routes>
		</ThemeProvider>
	)
}

function App() {
	return (
		<ErrorBoundary>
			<AppInsideErrorBoundary />
		</ErrorBoundary>
	);
}

export default App;
