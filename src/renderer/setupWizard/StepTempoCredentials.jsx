import PropTypes from 'prop-types';
import { useState } from 'react';
import FieldWithHelp from './FieldWithHelp';
import { Loader } from 'lucide-react';

export default function StepTempoCredentials({ goNext, goBack, jiraCreds, tempoToken, setTempoToken }) {
	const [error, setError] = useState(null);
	const [showToken, setShowToken] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleValidate = async () => {
		setError(null);
		setLoading(true);

		try {
			await window.api.validateTempo(tempoToken);
			goNext();
		} catch (err) {
			setError('Invalid Tempo token. Please check and try again.');
		} finally {
			setLoading(false);
		}
	};

	const tempoHelpText = `
		<p style="font-size: 0.875rem; color: #4B5563; margin-bottom: 0.5rem;">
			To generate a token:<br />
			<b>Go to Tempo → Settings → API Integration → New Token</b><br />
			Or visit:&nbsp;
				<a
				href="https://${jiraCreds.domain}/plugins/servlet/ac/io.tempo.jira/tempo-app#!/configuration/api-integration"
				target="_blank"
				rel="noreferrer"
				style="color: #2563EB; text-decoration: underline;"
				>
				your integrated Tempo app settings
				</a>
		</p>
	`;

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
			<div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6">
				<h2 className="text-xl font-bold">Step 2: Tempo Setup</h2>
				<FieldWithHelp
					label="Tempo API Token"
					helpImage="tempo-token-example.png"
					helpText={tempoHelpText}
				>
					<div className="relative w-full">
						<input
							type={showToken ? "text" : "password"}
							placeholder="Paste your Tempo API token here"
							value={tempoToken}
							onChange={e => setTempoToken(e.target.value)}
							className="w-full pr-24 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 rounded transition"
						/>
						<button
							type="button"
							onClick={() => setShowToken(prev => !prev)}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded transition"
						>
							{showToken ? "Hide" : "Show"}
						</button>
					</div>
				</FieldWithHelp>

				{error && <p className="text-red-600 font-medium">{error}</p>}

				<div className="flex justify-between mt-4">
					<button onClick={goBack} className="btn">← Back</button>
					<button
						onClick={handleValidate}
						className="btn flex items-center justify-center min-w-[180px]"
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader className="animate-spin w-4 h-4 mr-2" />
								Validating...
							</>
						) : (
							'Validate & Continue →'
						)}
					</button>
				</div>
			</div>
		</div >
	);
}

StepTempoCredentials.propTypes = {
	goNext: PropTypes.func.isRequired,
	goBack: PropTypes.func.isRequired,
	jiraCreds: PropTypes.shape({
		domain: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		token: PropTypes.string.isRequired,
	}).isRequired,
	setTempoToken: PropTypes.func.isRequired,
	tempoToken: PropTypes.string.isRequired,
};
