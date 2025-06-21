import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StepWelcome({ goNext }) {
	const [credsExist, setCredsExist] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const loadCreds = async () => {
			const config = await window.api.loadCredentials();

			setCredsExist(config.credentialsRetrieved);
		}

		loadCreds();
	}, [])

	return (
		<div className="min-h-screen flex items-center justify-center bg-white darkMode">
			<div className="p-6 space-y-6 max-w-md text-center darkMode">
				<h2 className="text-2xl font-bold">Welcome to KroniCode</h2>
				<p>Let’s get you set up to log your time automatically to Jira and Tempo.</p>

				<div className="flex items-center gap-3">
					{credsExist && (
						<button
							className="btn w-full max-w-xs"
							onClick={() => navigate('/popup')}
						>
							← Back to Logger
						</button>
					)}
					<button
						onClick={goNext}
						className="btn w-full max-w-xs"
					>
						Get Started →
					</button>
				</div>
			</div>
		</div>

	);
}

StepWelcome.propTypes = {
	goNext: PropTypes.func.isRequired
};
