import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentDateTime } from '../../utils/functions.js';
import { Settings, Loader, LogOut } from 'lucide-react';
import ToastBanner from '../components/ToastBanner.jsx';

export default function IssueLoggerScreen() {
	const navigate = useNavigate();
	const [ticket, setTicket] = useState('');
	const [startTime, setStartTime] = useState(getCurrentDateTime());
	const [duration, setDuration] = useState('15');
	const [description, setDescription] = useState('Dev work');
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState(null);

	useEffect(() => {
		if (!window.api) {
			console.error('Electron API not available');
		}
	}, []);

	const resetToast = (timeOut) => {
		setTimeout(() => {
			setToast(null);
		}, timeOut);
	}

	const handleSubmit = async () => {
		if (!window.api) {
			setToast({ message: "❌ API Clients not available", type: "error" });
			resetToast(5000);

			return;
		}

		setLoading(true);

		try {
			const result = await window.api.submitWorklog({ ticket, startTime, duration, description });

			if (result?.error) {
				setToast({ message: "❌ Something went wrong, please check your inputs and try again", type: "error" });
				resetToast(8000);
			} else {
				setToast({ message: "✅ Worklog submitted successfully!", type: "success" });
				resetToast(3000);
			}
		} catch (err) {
			setToast({ message: "❌ Something went wrong, please check your inputs and try again", type: "error" });
			resetToast(8000);
		} finally {
			setLoading(false);
		}
	};

	const handleQuit = () => {
		window.api.quitApp();
	};

	return (
		<>
			<ToastBanner
				message={toast?.message}
				visible={!!toast}
				type={toast?.type}
				progress={toast?.progress}
			/>

			<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
				<div className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6">
					<LogOut
						className="absolute top-2 left-2 h-6 w-6 text-gray-600 hover:text-red-600 cursor-pointer"
						onClick={handleQuit}
						aria-label="Quit KroniCode"
					/>
					<Settings
						className="absolute top-2 right-2 h-6 w-6 text-gray-600 hover:text-gray-900 cursor-pointer"
						onClick={() => navigate('/settings')}
						aria-label="Open Settings"
					/>

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
						className="btn flex items-center justify-center min-w-[180px]"
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader className="animate-spin w-4 h-4 mr-2" />
								Submitting...
							</>
						) : (
							'Submit'
						)}
					</button>
				</div>
			</div>
		</>

	);
}
