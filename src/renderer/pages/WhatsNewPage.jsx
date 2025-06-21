import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import releaseNotesData from '../../assets/releaseNotes.json';

export default function WhatsNewPage({ version }) {
	const navigate = useNavigate();

	if (!version) return null;

	const releaseEntry = releaseNotesData.find(r => r.version === version);
	const notes = releaseEntry ? releaseEntry.full : [];

	return (
		<div className="p-8 max-w-3xl mx-auto darkMode">
			<h1 className="text-3xl font-bold mb-6">What’s New in KroniCode v{version}</h1>
			<ul className="list-disc list-inside space-y-3 text-gray-800">
				{notes.map((item, i) => (
					<div key={i} className="mb-4">
						<h3 className="font-semibold text-gray-900">{item.title}</h3>
						<p className="text-gray-700 text-sm">{item.description}</p>
					</div>
				))}
			</ul>

			<br />
			<button
				onClick={() => navigate('/popup')}
				className="btn"
			>
				Continue →
			</button>
		</div>
	);
}

WhatsNewPage.propTypes = {
	version: PropTypes.string.isRequired,
};
