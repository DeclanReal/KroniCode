import { motion } from 'framer-motion';
import SuggestionTag from './SuggestionTag';
import PropTypes from 'prop-types';

export function SuggestionTags({ recentTickets, setSelectedBoardKey, setTicket }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 4 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className="mt-4 w-full"
		>
			<div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">
				Recently used
			</div>

			<div className="flex flex-nowrap gap-2 pb-2 overflow-x-auto overflow-y-hidden scrollbar-horizontal">
				{recentTickets?.length > 0 ? (
					recentTickets.map(ticket => (
						<SuggestionTag
							key={ticket.id}
							label={`${ticket.boardKey}-${ticket.number}`}
							onClick={() => {
								setSelectedBoardKey(ticket.boardKey);
								setTicket(ticket.number);
							}}
						/>
					))
				) : (
					<div>
						<p>N/A</p>
					</div>
				)}
			</div>
		</motion.div>
	)
}

SuggestionTags.propTypes = {
	recentTickets: PropTypes.array.isRequired,
	setSelectedBoardKey: PropTypes.func.isRequired,
	setTicket: PropTypes.func.isRequired,
};