import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

export function Dropdown({ defaultValue = 'Select Option', options, value, onChange }) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState('');

	const containerRef = useRef(null);
	const searchRef = useRef(null);

	useEffect(() => {
		if (open && searchRef.current) {
			searchRef.current.focus();
		}
	}, [open]);

	// handle clicks outside the dropdown to close the dropdown menu
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

	// (match from start of key)
	const filteredOptions = options.filter(option =>
		option.key.toLowerCase().includes(search.toLowerCase()) ||
		option.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div ref={containerRef} className="relative w-full max-w-xs">
			<button
				type="button"
				onClick={() => {
					setOpen(prev => !prev);
					setSearch(''); // reset search when reopening
				}}
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
				<ul className="absolute z-10 mt-1 w-full border rounded bg-white dark:bg-gray-700 shadow max-h-48 overflow-y-auto">
					<li className="p-1">
						<input
							ref={searchRef}
							type="text"
							placeholder="Search..."
							value={search}
							onChange={e => setSearch(e.target.value)}
							className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white bg-white text-black"
						/>
					</li>

					{filteredOptions.length > 0 ? (
						filteredOptions.map(option => (
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
						))
					) : (
						<li className="px-2 py-1 text-gray-500 dark:text-gray-400">No results</li>
					)}
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
