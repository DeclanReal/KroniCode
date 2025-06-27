import { Loader } from 'lucide-react';

export default function SplashScreen() {
	return (
		<div className="h-screen w-screen bg-zinc-900 text-white flex flex-col items-center justify-center">
			<h1 className="text-xl font-medium">Loading KroniCode...</h1>
			<Loader className="animate-spin mt-4 h-8 w-8 text-blue-500" />
		</div>
	);
}
