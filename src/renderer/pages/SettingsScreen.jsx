import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsScreen() {
	const navigate = useNavigate();
	const [interval, setIntervalValue] = useState('15');
	const [jiraDomain, setJiraDomain] = useState('');
	const [jiraEmail, setJiraEmail] = useState('');
	const [jiraToken, setJiraToken] = useState('');
	const [tempoToken, setTempoToken] = useState('');
	const [statusMessage, setStatusMessage] = useState('');

	useEffect(() => {
		if (!window.api) {
			console.error('Electron API not available');
			return;
		}

		window.api.getInterval().then(setIntervalValue);
		window.api.loadCredentials().then(({ jiraDomain, jiraEmail, jiraToken, tempoToken }) => {
			setJiraDomain(jiraDomain || '');
			setJiraEmail(jiraEmail || '');
			setJiraToken(jiraToken || '');
			setTempoToken(tempoToken || '');
		});
	}, []);

	const handleSave = async () => {
		window.api.setInterval(parseInt(interval));
		await window.api.saveCredentials({
			jiraDomain,
			jiraEmail,
			jiraToken,
			tempoToken,
		});

		setStatusMessage('✅ Settings saved!');
		setTimeout(() => {
			setStatusMessage('');
		}, 5000);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
			<div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6">
				<button className='btn' onClick={() => navigate('/popup')}>← Back to Logger</button>

				{statusMessage && (
					<div className="p-2 rounded bg-green-100 text-green-700">
						{statusMessage}
					</div>
				)}

				<h2 className="text-xl font-bold">Settings</h2>

				<div className="space-y-4">
					<div>
						<label className="block font-medium mb-1">Popup Interval (minutes): </label>
						<input
							value={interval}
							onChange={e => setIntervalValue(e.target.value)}
							className="w-full p-2 border rounded"
						/>
					</div>

					<div>
						<label className="block font-medium mb-1">Jira Domain: </label>
						<input
							value={jiraDomain}
							onChange={e => setJiraDomain(e.target.value)}
							className="w-full p-2 border rounded"
						/>
					</div>

					<div>
						<label className="block font-medium mb-1">Jira Email: </label>
						<input
							value={jiraEmail}
							onChange={e => setJiraEmail(e.target.value)}
							className="w-full p-2 border rounded"
						/>
					</div>

					<div>
						<label className="block font-medium mb-1">Jira API Token: </label>
						<input
							value={jiraToken}
							onChange={e => setJiraToken(e.target.value)}
							className="w-full p-2 border rounded"
						/>
					</div>

					<div>
						<label className="block font-medium mb-1">Tempo API Token: </label>
						<input
							value={tempoToken}
							onChange={e => setTempoToken(e.target.value)}
							className="w-full p-2 border rounded"
						/>
					</div>
				</div>

				<button
					onClick={handleSave}
					className="btn"
				>
					Save
				</button>
			</div>
		</div>
	);
}
