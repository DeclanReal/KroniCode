import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

export function Dropdown({ defaultValue = 'Select Option', options, value, onChange }) {
	const [open, setOpen] = useState(false);

	const containerRef = useRef(null);

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open]);

	return (
		<div ref={containerRef} className="relative w-full max-w-xs">
			<button
				type="button"
				onClick={() => setOpen(prev => !prev)}
				className="w-full border rounded px-2 py-1 flex justify-between items-center dark:bg-gray-800 dark:text-white bg-white text-black cursor-pointer"
			>
				<span>{value || defaultValue}</span>
				<svg
					className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{open && (
				<ul className="absolute z-10 mt-1 w-full border rounded bg-white dark:bg-gray-700 shadow">
					{options.map(option => (
						<li
							key={option.id}
							onClick={() => {
								onChange(option.key);
								setOpen(false);
							}}
							className="px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-black dark:text-white"
						>
							[{option.key}] {option.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

Dropdown.propTypes = {
	defaultValue: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			key: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired
		})
	).isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
