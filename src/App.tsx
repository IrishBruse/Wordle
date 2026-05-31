import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PlaySessionCleanup } from "#/game/PlaySessionCleanup";
import { Home } from "#/pages/Home";
import { PlayLevel } from "#/pages/PlayLevel";
import { PlayTutorial } from "#/pages/PlayTutorial";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

export function App() {
	return (
		<BrowserRouter basename={basename}>
			<PlaySessionCleanup />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/play" element={<PlayTutorial />} />
				<Route path="/play/:levelId" element={<PlayLevel />} />
			</Routes>
		</BrowserRouter>
	);
}
