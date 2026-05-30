import { useEffect, useState } from "react";

declare global {
	interface Window {
		D: boolean;
	}
}

const DEBUG_MODE_STORAGE_KEY = "wordle-debug-mode";
const DEBUG_MODE_EVENT = "wordle-debug-mode-change";

export function isDebugModeEnabled(): boolean {
	if (typeof window === "undefined") return false;
	return sessionStorage.getItem(DEBUG_MODE_STORAGE_KEY) === "1";
}

export function setDebugModeEnabled(enabled: boolean): void {
	if (typeof window === "undefined") return;
	if (enabled) {
		sessionStorage.setItem(DEBUG_MODE_STORAGE_KEY, "1");
	} else {
		sessionStorage.removeItem(DEBUG_MODE_STORAGE_KEY);
	}
	window.dispatchEvent(new Event(DEBUG_MODE_EVENT));
}

export function toggleDebugMode(): boolean {
	const next = !isDebugModeEnabled();
	setDebugModeEnabled(next);
	return next;
}

/** Type `D` in the browser console to toggle debug mode (each evaluation flips it). */
export function installDebugConsoleToggle(): void {
	if (typeof window === "undefined") return;
	if (Object.getOwnPropertyDescriptor(window, "D")) return;

	Object.defineProperty(window, "D", {
		configurable: true,
		get() {
			const enabled = toggleDebugMode();
			console.info(enabled ? "Debug mode enabled" : "Debug mode disabled");
			return enabled;
		},
	});
}

/** Debug mode flag; updates when toggled from the console. */
export function useDebugMode(): boolean {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		setEnabled(isDebugModeEnabled());
		const onChange = () => setEnabled(isDebugModeEnabled());
		window.addEventListener(DEBUG_MODE_EVENT, onChange);
		return () => window.removeEventListener(DEBUG_MODE_EVENT, onChange);
	}, []);

	return enabled;
}
