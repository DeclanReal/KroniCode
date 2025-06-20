import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
import { Modal } from './Modal';
import { useState } from 'react';

export function OnboardingTour({ run, onFinish }) {
	const [tourStartModal, setTourStartModal] = useState(true);
	const [tourEndModal, setTourEndModal] = useState(false);

	const steps = [
		{
			target: '#formContainer',
			content: 'Make sure you fill in all these fields before logging time.',
			disableBeacon: true,
		},
		{
			target: '#submitWorkLogBtn',
			content: 'Click here to log your time.',
			disableBeacon: true,
		},
		{
			target: '#settingsBtn',
			content: 'Click here to adjust your settings.',
			disableBeacon: true,
		},
		{
			target: '#closeAppBtn',
			content: 'Click here to quit the app.',
			disableBeacon: true,
		}
	];

	return (
		<>
			<Modal id='optionalEndTourModal' visible={tourEndModal}>
				<div className="mt-8 flex flex-col items-center space-y-4">
					<img src="tray-example.png" alt="Tray icon" />
					<p className="text-sm mt-2 text-center">
						This is what KroniCode looks like in your system tray.<br />
						You can right-click it for quick access to certain menus!<br />
						Or left click to re-open the app if closed.
					</p>
					<button
						className="btn"
						onClick={() => {
							setTourEndModal(false);
							onFinish();
						}}
					>
						Finish Tour →
					</button>
				</div>
			</Modal>

			<Modal id='beginTourModal' visible={run && tourStartModal} >
				<div className="flex items-center justify-center">
					<div className="text-center space-y-4">
						<h1 className="text-2xl font-bold">Welcome to KroniCode!</h1>
						<p>Let&apos;s get you familiarized with the app.</p>
						<button
							className="btn"
							onClick={() => {
								setTourStartModal(false);
							}}
						>
							Begin Tour →
						</button>
					</div>
				</div>
			</Modal >

			<Joyride
				steps={steps}
				run={!tourStartModal && run}
				continuous
				showSkipButton
				showProgress
				disableOverlayClose
				disableScrolling
				disableBeacon
				callback={(data) => {
					const { status } = data;
					if (status === 'skipped') onFinish();

					if (status === 'finished') {
						setTourEndModal(true);
					}
				}}
				styles={{
					options: {
						zIndex: 10000,
					},
				}}
			/>
		</>
	);
};

OnboardingTour.propTypes = {
	run: PropTypes.bool.isRequired,
	onFinish: PropTypes.func.isRequired
};
