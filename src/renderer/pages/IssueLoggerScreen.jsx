import { useEffect, useState } from 'react';
import { getCurrentDateTime } from '../../utils/functions.js';

export default function IssueLoggerScreen() {
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
			}
		} catch (err) {
			setStatusType('error');
			setStatusMessage(`❌ Error: ${err.message || 'Something went wrong'}`);
		}
	};

	return (
		<div className="p-4 space-y-2">
			{statusMessage && (
				<div
					className={`p-2 rounded ${statusType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
						}`}
				>
					{statusMessage}
				</div>
			)}

			<h2 className="text-xl font-bold">Log Time</h2>

			<input
				type="text"
				placeholder="Ticket (e.g. PRJ-123)"
				value={ticket}
				onChange={e => setTicket(e.target.value)}
				className="w-full border p-1"
			/>

			<input
				type="datetime-local"
				value={startTime}
				onChange={e => setStartTime(e.target.value)}
				className="w-full border p-1"
			/>

			<input
				type="number"
				placeholder="Time Spent (min)"
				title="Time Spent (minutes)"
				value={duration}
				onChange={e => setDuration(e.target.value)}
				className="w-full border p-1"
			/>

			<textarea
				placeholder="Description"
				value={description}
				onChange={e => setDescription(e.target.value)}
				className="w-full border p-1"
			/>

			<button
				onClick={handleSubmit}
				className="bg-blue-500 text-white px-4 py-2 rounded"
			>
				Submit
			</button>
		</div>
	);
}
