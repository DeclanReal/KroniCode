import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentDateTime } from '../../utils/functions.js';
import { Settings } from 'lucide-react';

export default function IssueLoggerScreen() {
	const navigate = useNavigate();
	const [ticket, setTicket] = useState('');
	const [startTime, setStartTime] = useState(getCurrentDateTime());
	const [duration, setDuration] = useState('15');
	const [description, setDescription] = useState('Dev work');
	const [statusMessage, setStatusMessage] = useState('');
	const [statusType, setStatusType] = useState(''); // 'success' | 'error'

	useEffect(() => {
		if (!window.api) {
			console.error('Electron API not available');
		}
	}, []);

	const handleSubmit = async () => {
		if (!window.api) {
			setStatusType('error');
			setStatusMessage('Electron API not available.');
			return;
		}

		try {
			const result = await window.api.submitWorklog({ ticket, startTime, duration, description });

			if (result?.error) {
				setStatusType('error');
				setStatusMessage(`❌ Failed to submit: ${result.message || 'Unknown error'}`);
			} else {
				setStatusType('success');
				setStatusMessage('✅ Worklog submitted successfully!');
				setTimeout(() => {
					setStatusMessage('');
				}, 5000);
			}
		} catch (err) {
			setStatusType('error');
			setStatusMessage(`❌ Error: ${err.message || 'Something went wrong'}`);
		}
	};

	return (

		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
			<div className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6">
				<Settings
					className="absolute top-2 right-2 h-6 w-6 text-gray-600 hover:text-gray-900 cursor-pointer"
					onClick={() => navigate('/settings')}
					aria-label="Open Settings"
				/>

				{statusMessage && (
					<div
						className={`p-2 rounded ${statusType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
							}`}
					>
						{statusMessage}
					</div>
				)}

				<h2 className="text-xl font-bold">Log Time</h2>

				<span className="font-medium">Issue Number</span>
				<input
					type="text"
					placeholder="Ticket (e.g. PRJ-123)"
					value={ticket}
					onChange={e => setTicket(e.target.value)}
					className="w-full border p-1"
				/>

				<span className="font-medium">Start Time</span>
				<input
					type="datetime-local"
					value={startTime}
					onChange={e => setStartTime(e.target.value)}
					className="w-full border p-1"
				/>

				<span className="font-medium">Time spent (in minutes)</span>
				<input
					type="number"
					placeholder="Time Spent (min)"
					title="Time Spent (minutes)"
					value={duration}
					onChange={e => setDuration(e.target.value)}
					className="w-full border p-1"
				/>

				<span className="font-medium">Description</span>
				<textarea
					placeholder="Description"
					value={description}
					onChange={e => setDescription(e.target.value)}
					className="w-full border p-1"
				/>

				<button
					onClick={handleSubmit}
					className="btn"
				>
					Submit
				</button>
			</div>
		</div>
	);
}
