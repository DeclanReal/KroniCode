// App.jsx
import { Routes, Route } from 'react-router-dom';
import IssueLoggerScreen from './pages/IssueLoggerScreen';
import SettingsScreen from './pages/SettingsScreen';

function App() {
  return (
    <Routes>
      <Route path="/popup" element={<IssueLoggerScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      {/* Fallback route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
