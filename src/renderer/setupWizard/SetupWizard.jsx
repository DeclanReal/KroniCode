import { useState } from 'react';
import StepWelcome from './StepWelcome';
import StepJiraCredentials from './StepJiraCredentials';
import StepTempoCredentials from './StepTempoCredentials';
import StepFinish from './StepFinish';

const steps = ['welcome', 'jira', 'tempo', 'finish'];

export default function SetupWizard() {
	const [currentStep, setCurrentStep] = useState(0);
	const [jiraCreds, setJiraCreds] = useState({ domain: '', email: '', token: '' });
	const [tempoToken, setTempoToken] = useState('');

	const goNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
	const goBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

	const stepProps = { goNext, goBack, jiraCreds, setJiraCreds, tempoToken, setTempoToken };

	switch (steps[currentStep]) {
		case 'welcome': return <StepWelcome {...stepProps} />;
		case 'jira': return <StepJiraCredentials {...stepProps} />;
		case 'tempo': return <StepTempoCredentials {...stepProps} />;
		case 'finish': return <StepFinish jiraCreds={jiraCreds} tempoToken={tempoToken} />;
		default: return null;
	}
}
