// App.jsx
import { Routes, Route } from 'react-router-dom';
import IssueLoggerScreen from './pages/IssueLoggerScreen';

function App() {
  return (
    <Routes>
      <Route path="/popup" element={<IssueLoggerScreen />} />
      {/* Fallback route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
