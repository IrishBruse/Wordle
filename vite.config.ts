import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repoBase = process.env.VITE_BASE_PATH ?? "/Wordle/";

const config = defineConfig({
	base: repoBase,
	resolve: { tsconfigPaths: true },
	plugins: [tailwindcss(), viteReact()],
});

export default config;
