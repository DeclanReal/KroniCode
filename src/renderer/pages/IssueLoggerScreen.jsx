import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentDateTime } from '../../utils/functions.js';
import { Settings, Loader, LogOut } from 'lucide-react';
import ToastBanner from '../components/ToastBanner.jsx';
import { OnboardingTour } from '../components/OnboardingTour.jsx';
import { Dropdown } from '../components/DropDown.jsx';
import { Business } from '../business/Business.js';
import { SuggestionTags } from '../components/SuggestionTagsComponent.jsx';

export default function IssueLoggerScreen() {
	const navigate = useNavigate();

	// time logs display states
	const [todaysTimeLogged, setTodaysTimeLogged] = useState('N/A');
	const [thisWeeksTimeLogged, setThisWeeksTimeLogged] = useState('N/A');

	// form data states
	const [boardKeys, setBoardKeys] = useState([]);
	const [recentTickets, setRecentTickets] = useState([]);
	const [ticket, setTicket] = useState('');
	const [selectedBoardKey, setSelectedBoardKey] = useState();
	const [description, setDescription] = useState('Dev work');
	const [duration, setDuration] = useState('15');
	const [startTime, setStartTime] = useState(getCurrentDateTime());

	// toast and util states
	const [toast, setToast] = useState(null);
	const [loading, setLoading] = useState(false);
	const [runTour, setRunTour] = useState(false);
	const [business] = new useState(new Business(setToast));

	useEffect(() => {
		if (!window.api) {
			console.error('Electron API not available');
			setToast({ message: "❌ API Clients not available, please restart the app.", type: "error" });
		}

		if (window.api.onRunGuidedTour) {
			window.api.onRunGuidedTour(() => {
				setRunTour(true);
			});
		}

		const loadDisplays = async () => {
			await updateDisplays();
			await business.retrieveBoardKeys(setBoardKeys);
		}

		loadDisplays();
		resetToast(4000)

		const hasSeenTour = localStorage.getItem('hasSeenTour');

		if (hasSeenTour !== 'true') {
			setRunTour(true);
		}
	}, []);

	const handleQuit = () => {
		window.api.quitApp();
	};

	const handleSubmit = async () => {
		if (!window.api) {
			setToast({ message: "❌ API Clients not available, please restart the app.", type: "error" });

			return;
		}

		setLoading(true);

		const success = business.handleWorklogSubmit(setLoading, { selectedBoardKey, ticket, startTime, duration, description });

		if (success) {
			setToast({ message: "✅ Worklog submitted successfully!", type: "success" });

			await updateDisplays();

			resetToast(3000)
		} else {
			setToast({ message: "❌ Something went wrong, please check your inputs and try again", type: "error" });
			resetToast(8000);
		}

		setLoading(false);
	}

	const updateDisplays = async () => {
		// refresh users logged time
		await business.retrieveUsersWeeklyWorkLogs(setTodaysTimeLogged, setThisWeeksTimeLogged);

		// update recent tickets display
		window.api.addToRecentTickets({ id: crypto.randomUUID(), boardKey: selectedBoardKey, number: ticket });
		await business.retrieveRecentTickets(setRecentTickets);
	}

	const resetToast = (timeOut) => {
		setTimeout(() => {
			setToast(null);
		}, timeOut);
	}

	const handleTourFinish = () => {
		localStorage.setItem('hasSeenTour', 'true');
		setRunTour(false);
	};

	return (
		<>
			<ToastBanner
				message={toast?.message}
				visible={!!toast}
				type={toast?.type}
				progress={toast?.progress}
			/>

			<OnboardingTour run={runTour} onFinish={handleTourFinish} />

			<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 darkMode">
				<div className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6 darkMode">
					<LogOut
						id='closeAppBtn'
						className="absolute top-2 left-2 h-6 w-6 text-gray-600 hover:text-red-600 cursor-pointer dark:text-white dark:hover:text-red-600"
						onClick={handleQuit}
						aria-label="Quit KroniCode"
					/>
					<Settings
						id='settingsBtn'
						className="absolute top-2 right-2 h-6 w-6 text-gray-600 hover:text-gray-900 
						cursor-pointer dark:text-white dark:hover:text-gray-500"
						onClick={() => navigate('/settings')}
						aria-label="Open Settings"
					/>

					<br />

					<h2 className="text-xl font-bold">Log Time</h2>

					<div id='formContainer' className='space-y-4'>
						<div className="flex flex-col gap-2">
							<label className="font-medium">Ticket Number</label>

							<div className="flex items-center gap-2">
								<Dropdown
									defaultValue='Select Project Key'
									options={boardKeys}
									value={selectedBoardKey}
									onChange={setSelectedBoardKey}
								/>
								<span className="font-bold text-gray-600 dark:text-white">-</span>

								<input
									type="text"
									placeholder="Ticket Number (e.g. 123)"
									value={ticket}
									onChange={e => setTicket(e.target.value)}
									className="w-full border rounded px-2 py-1 text-black dark:text-white bg-white dark:bg-gray-800"
								/>
							</div>
						</div>

						<SuggestionTags recentTickets={recentTickets} setSelectedBoardKey={setSelectedBoardKey} setTicket={setTicket} />

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
					</div>

					<button
						id='submitWorkLogBtn'
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

					<div id='loggedTime' className="text-xs text-gray-600 text-right p-2 border-t dark:text-white">
						<strong>Logged today:</strong> {todaysTimeLogged} &nbsp;|&nbsp;
						<strong>This week:</strong> {thisWeeksTimeLogged}
					</div>
				</div>
			</div>
		</>

	);
}
