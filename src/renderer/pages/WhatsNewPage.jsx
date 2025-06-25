import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import releaseNotesData from '../../assets/releaseNotes.json';

export default function WhatsNewPage({ version }) {
	const navigate = useNavigate();

	if (!version) return null;

	function groupByType(notes) {
		return notes.reduce((groups, note) => {
			const { type } = note;

			if (!groups[type]) groups[type] = [];

			groups[type].push(note);

			return groups;
		}, {});
	}

	const releaseEntry = releaseNotesData.find(r => r.version === version);
	const notes = releaseEntry ? releaseEntry.full : [];

	const groupedNotes = groupByType(notes);

	const typeOrder = ['feature', 'improvement', 'bugfix']; // preferred order
	const typeLabels = {
		feature: 'Features',
		improvement: 'Improvements',
		bugfix: 'Bug Fixes',
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 darkMode">
			<div className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6 darkMode">
				<h1 className="text-3xl font-bold mb-6">What’s New in KroniCode v{version}</h1>
				{typeOrder.map((type) =>
					groupedNotes[type] ? (
						<section key={type} className="mb-8">
							<h2 className="pulse-underline text-2xl font-extrabold mb-6 uppercase tracking-wide text-gray-800 dark:text-gray-200 pb-2">
								{typeLabels[type]}
							</h2>
							{groupedNotes[type].map((item, i) => (
								<div key={i} className="mb-4">
									<h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-1 mb-2">
										{item.title}
									</h3>
									<p className="text-gray-700 text-sm dark:text-gray-300">{item.description}</p>
								</div>
							))}
						</section>
					) : null
				)}

				<br />
				<button
					onClick={() => navigate('/popup')}
					className="btn"
				>
					Continue →
				</button>
			</div>
		</div>
	);
}

WhatsNewPage.propTypes = {
	version: PropTypes.string.isRequired,
};
