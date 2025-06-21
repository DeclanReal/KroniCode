import { Loader } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toggle } from '../components/Toggle';
import ToastBanner from '../components/ToastBanner';
import { ThemeContext } from '../components/ThemeContext';

export default function SettingsScreen() {
	const navigate = useNavigate();
	const [interval, setIntervalValue] = useState('15');
	const [jiraDomain, setJiraDomain] = useState('');
	const [jiraEmail, setJiraEmail] = useState('');
	const [jiraToken, setJiraToken] = useState('');
	const [tempoToken, setTempoToken] = useState('');
	const [loading, setLoading] = useState(false);
	const [startOnBoot, setStartOnBoot] = useState(false);
	const [toast, setToast] = useState(null);
	const { darkMode, toggleDarkMode } = useContext(ThemeContext);

	useEffect(() => {
		if (!window.api) {
			console.error('Electron API not available');
			return;
		}

		window.api.getStartup().then(setStartOnBoot);
		window.api.getInterval().then(setIntervalValue);
		window.api.loadCredentials().then(({ jiraDomain, jiraEmail, jiraToken, tempoToken }) => {
			setJiraDomain(jiraDomain || '');
			setJiraEmail(jiraEmail || '');
			setJiraToken(jiraToken || '');
			setTempoToken(tempoToken || '');
		});
	}, []);

	const resetToast = (timeOut) => {
		setTimeout(() => {
			setToast(null);
		}, timeOut);
	}

	const handleSave = async () => {
		setLoading(true);

		try {
			window.api.setInterval(parseInt(interval));
			window.api.setStartup(startOnBoot);
			localStorage.setItem('darkMode', darkMode);

			const { success } = await window.api.saveCredentials({
				jiraDomain,
				jiraEmail,
				jiraToken,
				tempoToken,
			});

			if (!success) {
				setToast({ message: "❌ Something went wrong, please check your inputs and try again", type: "error" });
				resetToast(8000);
			} else {
				setToast({ message: "✅ Settings saved!", type: "success" });
				resetToast(3000);
			}
		} catch (err) {
			setToast({ message: "❌ Something went wrong, please check your inputs and try again", type: "error" });
			resetToast(8000);
		} finally {
			setLoading(false);
		}
	};

	const handleBack = () => {
		const saved = localStorage.getItem('darkMode') === 'true';
		const originalMode = saved;

		if (originalMode !== darkMode) {
			toggleDarkMode(originalMode);
			localStorage.setItem('darkMode', originalMode);
		}

		navigate('/popup');
	}

	return (
		<>
			<ToastBanner
				message={toast?.message}
				visible={!!toast}
				type={toast?.type}
				progress={toast?.progress}
			/>
			<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 darkMode">
				<div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6 darkMode">
					<button className='btn' onClick={handleBack}>← Back to Logger</button>

					<h2 className="text-xl font-bold">Settings</h2>

					<div className="space-y-4">
						<div>
							<Toggle label={"Toggle Dark Mode"} checked={darkMode} toggleChecked={toggleDarkMode} />
						</div>

						<div>
							<Toggle label={"Start with system"} checked={startOnBoot} toggleChecked={setStartOnBoot} />
						</div>

						<div>
							<label className="block font-medium mb-1">Remind me every X minutes: </label>
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
						className="btn flex items-center justify-center min-w-[180px]"
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader className="animate-spin w-4 h-4 mr-2" />
								Saving...
							</>
						) : (
							'Save'
						)}
					</button>
				</div>
			</div>
		</>
	);
}
