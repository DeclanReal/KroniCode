import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import releaseNotesData from '../../assets/releaseNotes.json';

export default function WhatsNewModal({ version }) {
	const [isVisible, setIsVisible] = useState(false);
	const [showWhatsNew, setShowWhatsNew] = useState(false);
	const navigate = useNavigate();

	// Show modal once per new version
	useEffect(() => {
		const checkShowWhatsNew = async () => {
			const { setupComplete } = await window.api.loadCredentials();

			setShowWhatsNew(setupComplete);
		};

		checkShowWhatsNew();

		const lastSeenVersion = localStorage.getItem('lastSeenVersion') || '';

		if (lastSeenVersion !== version) {
			setIsVisible(true);
			localStorage.setItem('lastSeenVersion', version);
		}
	}, [version]);

	if (!isVisible || !showWhatsNew) return null;

	const releaseEntry = releaseNotesData.find(r => r.version === version);
	const notes = releaseEntry ? releaseEntry.minimal : [];

	return (
		<div
			className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm"
		>
			<div
				className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg"
				onClick={e => e.stopPropagation()}
			>
				<h2 className="text-xl font-semibold mb-3">KroniCode updated to v{version}</h2>
				<ul className="list-disc list-inside space-y-3 text-gray-800">
					{notes.map((note, i) => (
						<li key={i}>{note}</li>
					))}
				</ul>

				<div className="flex justify-between items-center mt-6">
					<button
						onClick={() => setIsVisible(false)}
						className="btn"
					>
						Close
					</button>
					<button
						onClick={() => {
							setIsVisible(false);
							navigate('/whats-new');
						}}
						className="btn"
					>
						See all changes →
					</button>
				</div>
			</div>
		</div>
	);
}

WhatsNewModal.propTypes = {
	version: PropTypes.string.isRequired,
};
