import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function StepFinish({ jiraCreds, tempoToken }) {
	const navigate = useNavigate();
	const [interval, setInterval] = useState(15); // default 15 minutes
	const [error, setError] = useState(null);
	const [saving, setSaving] = useState(false);

	const handleFinish = async () => {
		// Basic validation: interval must be a positive integer >= 1
		if (!interval || isNaN(interval) || interval < 1) {
			setError('Please enter a valid interval (1 minute or more).');
			return;
		}
		setError(null);
		setSaving(true);

		try {
			await window.api.saveCredentials({
				jiraDomain: jiraCreds.domain,
				jiraEmail: jiraCreds.email,
				jiraToken: jiraCreds.token,
				tempoToken,
			});

			// Save the popup interval too
			await window.api.setInterval(Number(interval));

			navigate('/popup');
		} catch (e) {
			setError('Failed to save credentials. Please try again.');
			setSaving(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
			<div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6">
				<div className="flex justify-center">
					<h2 className="text-xl font-bold">All Set!</h2>
				</div>
				<p>Your credentials have been verified and securely stored. You can now start logging your work effortlessly.</p>

				<div>
					<label htmlFor="popupInterval" className="block text-gray-700 font-medium mb-1">
						Remind me every X minutes:
					</label>
					<input
						id="popupInterval"
						type="number"
						min={1}
						value={interval}
						onChange={e => setInterval(e.target.value)}
						className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
						disabled={saving}
					/>
					{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
				</div>

				<div className="flex justify-center">
					<button
						onClick={handleFinish}
						disabled={saving}
						className="btn w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{saving ? 'Saving...' : 'Go to Logger'}
					</button>
				</div>
			</div>
		</div>
	);
}

StepFinish.propTypes = {
	jiraCreds: PropTypes.shape({
		domain: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		token: PropTypes.string.isRequired,
	}).isRequired,
	tempoToken: PropTypes.string.isRequired,
};
