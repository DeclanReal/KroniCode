// App.jsx
import './index.css';

import { Routes, Route } from 'react-router-dom';
import IssueLoggerScreen from './pages/IssueLoggerScreen';
import SettingsScreen from './pages/SettingsScreen';
import SetupWizard from './setupWizard/SetupWizard';

function App() {
	return (
		<Routes>
			<Route path="/wizard" element={<SetupWizard />} />
			<Route path="/popup" element={<IssueLoggerScreen />} />
			<Route path="/settings" element={<SettingsScreen />} />
			{/* Fallback route */}
			<Route path="*" element={<div>404 Not Found</div>} />
		</Routes>
	);
}

export default App;
