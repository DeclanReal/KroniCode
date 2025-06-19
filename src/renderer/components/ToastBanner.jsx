import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

export default function ToastBanner({ message, visible, type = "info", progress = null }) {
	const bgColor = {
		info: "bg-blue-600",
		success: "bg-green-600",
		error: "bg-red-600",
	}[type] || "bg-gray-800";

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ y: -40, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -40, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className={`fixed top-0 inset-x-0 z-50 text-white text-center rounded-md shadow-lg ${bgColor} mx-auto w-full max-w-sm`}
				>
					<div className="relative py-2 px-4 text-sm font-medium">
						{message}

						{/* Embedded progress bar (acts as an underline) */}
						{typeof progress === "number" && progress < 100 && (
							<motion.div
								className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-r-md"
								style={{ borderBottomLeftRadius: '0.25rem' }}
								initial={{ width: "0%" }}
								animate={{ width: `${progress}%` }}
								transition={{ ease: "easeOut", duration: 0.2 }}
							/>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

ToastBanner.propTypes = {
	message: PropTypes.string.isRequired,
	visible: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired,
	progress: PropTypes.number.isRequired
};
