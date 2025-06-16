import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsScreen() {
	const navigate = useNavigate();
	const [interval, setIntervalValue] = useState('15');
	const [statusMessage, setStatusMessage] = useState('');

	useEffect(() => {
		if (!window.api) {
			console.error('Electron API not available');
			return;
		}

		window.api.getInterval().then(setIntervalValue);
	}, []);

	const handleSave = () => {
		window.api.setInterval(parseInt(interval));
		setStatusMessage('✅ Settings saved!');
	};

	return (
		<div className="p-4 space-y-2">
			<button onClick={() => navigate('/popup')}>Back to Logger</button>

			{statusMessage && (
				<div className={`p-2 rounded bg-green-100 text-green-700`} >
					{statusMessage}
				</div>
			)}
			
			<h2 className="text-xl font-bold">Settings</h2>
			<input placeholder="Popup Interval (minutes)" value={interval} onChange={e => setIntervalValue(e.target.value)} />
			<button onClick={handleSave}>Save</button>
		</div>
	);
}
