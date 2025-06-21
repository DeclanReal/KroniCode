import PropTypes from 'prop-types';
import { useState } from 'react';
import FieldWithHelp from './FieldWithHelp';
import { Loader } from 'lucide-react';

export default function StepJiraCredentials({ goNext, goBack, jiraCreds, setJiraCreds }) {
	const [error, setError] = useState(null);
	const [showToken, setShowToken] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleValidate = async () => {
		setError(null);
		setLoading(true);

		try {
			await window.api.validateJira(jiraCreds);
			goNext();
		} catch (err) {
			setError('Invalid Jira credentials. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 darkMode">
			<div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6 darkMode">
				<h2 className="text-xl font-bold">Step 1: Jira Setup</h2>

				{/* Domain */}
				<FieldWithHelp
					label="Jira Domain"
					helpImage="jira-domain-example.png"
					helpText="This is your full Jira domain (including <code>.atlassian.net</code>).
					For example, if your Jira URL is <code>https://myteam.atlassian.net</code>,
					your domain is <b>myteam.atlassian.net</b>."
				>
					<input
						placeholder="e.g. myteam.atlassian.net"
						value={jiraCreds.domain}
						onChange={e => setJiraCreds({ ...jiraCreds, domain: e.target.value })}
						className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 rounded transition"
					/>
				</FieldWithHelp>

				{/* Email */}
				<FieldWithHelp
					label="Jira Email"
					helpText="
					<p className='text-sm text-gray-600 mb-1'>
						This is the email address you use to log into Jira (usually your work email).
					</p>
					<p>
						This can be found at&nbsp;
						<a
							href='https://id.atlassian.com/manage-profile/profile-and-visibility'
							target='_blank'
							rel='noreferrer'
							class='text-blue-600 underline dark:text-blue-300'
						>
							Account Settings
						</a>
						&nbsp;under Contact.
					</p>
				"
				>
					<input
						placeholder="e.g. john.doe@example.com"
						value={jiraCreds.email}
						onChange={e => setJiraCreds({ ...jiraCreds, email: e.target.value })}
						className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 rounded transition"
					/>
				</FieldWithHelp>

				{/* API Token */}
				<FieldWithHelp
					label="Jira API Token"
					helpImage="jira-token-example.png"
					helpText="
					<p className='text-sm text-gray-600 mb-1'>
					Create a token from your Atlassian account at&nbsp;
						<a
							href='https://id.atlassian.com/manage-profile/security/api-tokens'
							target='_blank'
							rel='noreferrer'
							class='text-blue-600 underline dark:text-blue-300'
						>
							atlassian.com/api-tokens
						</a>
					</p>
					<p className='text-sm text-gray-600 mb-1'>
						Once you’re on the token page, click the <b>Create API Token</b> button.
					</p>
					<p className='text-sm text-gray-600 mb-1'>
						Give it a name and expiry date. I recommend the longest period (1 year).
					</p>
					<p className='text-sm text-gray-600 mb-1'>
						Click <b>Create</b>.
					</p>
					<p className='text-sm text-gray-600 mb-2'>
						Be sure to copy and save the token — it will only be shown once.
						If you lose it, you’ll need to create a new one.
					</p>
				"
				>
					<div className="relative w-full">
						<input
							type={showToken ? "text" : "password"}
							placeholder="e.g. abc123xyz456..."
							value={jiraCreds.token}
							onChange={e => setJiraCreds({ ...jiraCreds, token: e.target.value })}
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

				{/* Error */}
				{error && <p className="text-red-600 font-medium">{error}</p>}

				<br />
				{/* Navigation */}
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
		</div>
	);
}

StepJiraCredentials.propTypes = {
	goNext: PropTypes.func.isRequired,
	goBack: PropTypes.func.isRequired,
	jiraCreds: PropTypes.shape({
		domain: PropTypes.string,
		email: PropTypes.string,
		token: PropTypes.string,
	}).isRequired,
	setJiraCreds: PropTypes.func.isRequired,
};
