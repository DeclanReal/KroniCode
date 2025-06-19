import './index.css';

import { Routes, Route } from 'react-router-dom';
import IssueLoggerScreen from './pages/IssueLoggerScreen';
import SettingsScreen from './pages/SettingsScreen';
import SetupWizard from './setupWizard/SetupWizard';
import WhatsNewPage from './pages/WhatsNewPage';
import { useEffect, useState } from 'react';
import WhatsNewModal from './components/WhatsNewModal';

function App() {
	const [version, setVersion] = useState(null);

	useEffect(() => {
		window.api.getAppVersion().then(setVersion);
	}, []);

	if (!version) return null;

	return (
		<>
			<WhatsNewModal version={version} />

			<Routes>
				<Route path="/wizard" element={<SetupWizard />} />
				<Route path="/popup" element={<IssueLoggerScreen />} />
				<Route path="/settings" element={<SettingsScreen />} />
				<Route path="/whats-new" element={<WhatsNewPage version={version} />} />
				{/* Fallback route */}
				<Route path="*" element={<div>404 Not Found</div>} />
			</Routes>
		</>
	);
}

export default App;
