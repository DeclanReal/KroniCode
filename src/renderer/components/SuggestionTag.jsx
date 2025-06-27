import PropTypes from "prop-types";

export default function SuggestionTag({ label, onClick, title }) {
	return (
		<button
			onClick={() => onClick(label)}
			className="flex-1 basis-0 min-w-fit px-4 py-1 rounded-full text-sm
             bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 
             hover:bg-blue-100 dark:hover:bg-blue-900 
             border border-zinc-300 dark:border-zinc-700 
			 transition text-center cursor-pointer"
			title={title || `Use ${label}`}
		>
			{label}
		</button>
	);
}

SuggestionTag.propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};

