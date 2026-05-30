import { useEffect, useState } from "react";

export function isLocalhost(): boolean {
	if (typeof window === "undefined") return false;
	const { hostname } = window.location;
	return (
		hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
	);
}

/** Localhost check safe for SSR (false until mounted on the client). */
export function useIsLocalhost(): boolean {
	const [localhost, setLocalhost] = useState(false);
	useEffect(() => {
		setLocalhost(isLocalhost());
	}, []);
	return localhost;
}
