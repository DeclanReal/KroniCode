import * as Switch from "@radix-ui/react-switch";
import { Check, X } from "lucide-react";
import PropTypes from "prop-types";

export function Toggle({ label, checked, toggleChecked }) {
	return (
		<div className="flex items-center space-x-3">
			<span className="select-none block font-medium mb-1">
				{label}
			</span>

			<Switch.Root
				checked={checked}
				onCheckedChange={toggleChecked}
				className={`relative inline-flex h-6 w-12 items-center rounded-full ${checked ? "bg-blue-600" : "bg-gray-600"} focus:outline-none cursor-pointer`}
			>
				<Switch.Thumb
					className="block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out
            data-[state=checked]:translate-x-7 cursor-pointer"
				/>
			</Switch.Root>

			{checked ? (
				<Check className="text-green-500" size={20} />
			) : (
				<X className="text-red-500" size={20} />
			)}
		</div>
	);
}

Toggle.propTypes = {
	label: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
	toggleChecked: PropTypes.func.isRequired
};
