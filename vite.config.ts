import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "vite";

const repoBase = process.env.VITE_BASE_PATH ?? "/Wordle/";

function redirectRootToBaseMiddleware(
	base: string,
): Connect.NextHandleFunction {
	const target = base.endsWith("/") ? base : `${base}/`;
	const bare = target.replace(/\/$/, "");

	return (req, res, next) => {
		const raw = req.url ?? "/";
		const pathname = raw.split("?")[0] ?? "/";
		const query = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";

		if (pathname !== "/" && pathname !== bare) {
			next();
			return;
		}

		res.statusCode = 302;
		res.setHeader("Location", `${target}${query}`);
		res.end();
	};
}

/** Send `/` and `/Wordle` to `/Wordle/` instead of Vite's base-URL hint page. */
function redirectToBaseWithSlash(base: string): Plugin {
	const middleware = redirectRootToBaseMiddleware(base);

	return {
		name: "redirect-to-base-with-slash",
		configureServer: {
			order: "pre",
			handler(server) {
				server.middlewares.use(middleware);
			},
		},
		configurePreviewServer: {
			order: "pre",
			handler(server) {
				server.middlewares.use(middleware);
			},
		},
	};
}

const config = defineConfig({
	base: repoBase,
	resolve: { tsconfigPaths: true },
	plugins: [redirectToBaseWithSlash(repoBase), tailwindcss(), viteReact()],
	test: {
		environment: "node",
		environmentMatchGlobs: [
			["src/pages/**", "jsdom"],
			["src/**/*.test.tsx", "jsdom"],
		],
	},
});

export default config;
