import PropTypes from 'prop-types';
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Modal } from '../components/Modal';

export default function FieldWithHelp({ label, children, helpImage, helpText }) {
	const [showHelp, setShowHelp] = useState(false);

	return (
		<div className="relative space-y-2 darkMode">
			<div className="flex items-center gap-1 mb-1 text-sm text-gray-700 font-semibold darkMode">
				<span className="font-medium">{label}</span>
				{/* Tooltip with Radix */}
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger asChild>
							<HelpCircle size={16} onClick={() => setShowHelp(prev => !prev)} />
						</Tooltip.Trigger>

						<Tooltip.Portal>
							<Tooltip.Content
								side="top"
								align="center"
								className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-sm z-50 animate-fade-in"
							>
								Show help
								<Tooltip.Arrow className="fill-gray-800" />
							</Tooltip.Content>
						</Tooltip.Portal>
					</Tooltip.Root>
				</Tooltip.Provider>
			</div>

			{children}

			{showHelp && (
				<Modal visible={showHelp}>
					<button
						type="button"
						onClick={() => setShowHelp(false)}
						className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-400"
						aria-label="Close help popup"
					>
						&#x2715; {/* simple X close icon */}
					</button>

					{helpText && (
						<p
							className="mb-4 text-gray-700 text-sm dark:text-white"
							dangerouslySetInnerHTML={{ __html: helpText }}
						/>
					)}

					{helpImage && (
						<img
							src={helpImage}
							alt={`${label} help`}
							className="rounded border border-gray-300 w-full"
						/>
					)}
				</Modal>
			)}
		</div>
	);
}

FieldWithHelp.propTypes = {
	label: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	helpImage: PropTypes.string,
	helpText: PropTypes.string,
};
