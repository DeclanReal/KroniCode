import React from "react";
import PropTypes from "prop-types";
import { LogOut } from "lucide-react";

export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, info) {
		console.error("Uncaught error:", error, info);
	}

	handleReset() {
		window.api.restartApp();
	};

	handleQuit() {
		window.api.quitApp();
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
					<div className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6 text-red-600 text-center">
						<LogOut
							className="absolute top-2 left-2 h-6 w-6 text-gray-600 hover:text-red-600 cursor-pointer"
							onClick={this.handleQuit}
							aria-label="Quit KroniCode"
						/>

						<h2 className="text-lg font-semibold mb-2">Something went wrong.</h2>
						<p className="text-sm mb-4">Please restart the app or contact support.</p>

						<button
							onClick={this.handleReset}
							className="btn"
						>
							Restart App
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
};
