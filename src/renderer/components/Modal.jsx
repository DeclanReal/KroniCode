import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export function Modal({ visible, children }) {
	const [shouldRender, setShouldRender] = useState(visible);
	const [showAnimation, setShowAnimation] = useState(false);

	useEffect(() => {
		if (visible) {
			setShouldRender(true);
			// Allow the component to mount before triggering animation
			requestAnimationFrame(() => setShowAnimation(true));
		} else {
			setShowAnimation(false);
			const timeout = setTimeout(() => setShouldRender(false), 200);
			return () => clearTimeout(timeout);
		}
	}, [visible]);

	if (!shouldRender) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 z-40 backdrop-blur-sm bg-black/30 transition-opacity duration-500 ${showAnimation ? "opacity-100" : "opacity-0"}`}
			/>

			{/* Modal */}
			<div
				className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-500 ${showAnimation ? "opacity-100" : "opacity-0"}`}
			>
				<div
					className={`bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh]
						overflow-auto p-6 transform transition-all duration-500 ${showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"} darkMode`}
				>
					{children}
				</div>
			</div>
		</>
	);
}

Modal.propTypes = {
	visible: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired,
};
