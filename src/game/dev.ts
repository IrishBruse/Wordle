export function isLocalhost(): boolean {
	if (typeof window === "undefined") return false;
	const { hostname } = window.location;
	return (
		hostname === "localhost" ||
		hostname === "127.0.0.1" ||
		hostname === "[::1]"
	);
}
