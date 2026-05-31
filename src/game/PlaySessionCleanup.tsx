import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { clearAllActiveLevelSeeds } from "./seed";

/** Forget in-flight seeds when leaving /play so the next visit can advance. */
export function PlaySessionCleanup() {
	const location = useLocation();
	const prevPathRef = useRef(location.pathname);

	useEffect(() => {
		const prev = prevPathRef.current;
		const next = location.pathname;
		prevPathRef.current = next;
		const leftPlay = prev.startsWith("/play") && !next.startsWith("/play");
		if (leftPlay) clearAllActiveLevelSeeds();
	}, [location.pathname]);

	return null;
}
