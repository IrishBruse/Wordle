import { createServer } from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist/client");
const serverFile = path.join(root, "dist/server/server.js");

function normalizeBase(basePath) {
	if (!basePath || basePath === "/") return "";
	let base = basePath;
	if (!base.startsWith("/")) base = `/${base}`;
	if (base.endsWith("/")) base = base.slice(0, -1);
	return base;
}

const base = normalizeBase(process.env.VITE_BASE_PATH);
const routes = [`${base}/`, `${base}/play`, `${base}/play/1`];

async function startPreviewServer() {
	const mod = await import(pathToFileURL(serverFile).href);

	return new Promise((resolve) => {
		const server = createServer(async (req, res) => {
			try {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const response = await mod.default.fetch(new Request(url));
				res.writeHead(response.status, Object.fromEntries(response.headers));
				res.end(Buffer.from(await response.arrayBuffer()));
			} catch (error) {
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end(String(error));
			}
		});

		server.listen(0, "127.0.0.1", () => {
			const { port } = server.address();
			resolve({
				fetch: (pathname) =>
					fetch(`http://127.0.0.1:${port}${pathname}`),
				close: () => new Promise((done) => server.close(done)),
			});
		});
	});
}

function routeToOutputFile(routePath) {
	let relative = routePath;
	if (base && relative.startsWith(base)) {
		relative = relative.slice(base.length) || "/";
	}
	if (relative === "/" || relative === "") {
		return path.join(outDir, "index.html");
	}
	const segments = relative.replace(/^\//, "").replace(/\/$/, "");
	return path.join(outDir, segments, "index.html");
}

const preview = await startPreviewServer();

try {
	let shellHtml = "";

	for (const route of routes) {
		const response = await preview.fetch(route);
		if (!response.ok) {
			throw new Error(`Failed to export ${route}: HTTP ${response.status}`);
		}

		const html = await response.text();
		const outputFile = routeToOutputFile(route);
		await mkdir(path.dirname(outputFile), { recursive: true });
		await writeFile(outputFile, html);

		if (route.endsWith("/")) {
			shellHtml = html;
		}

		console.log(`Exported ${route} -> ${path.relative(root, outputFile)}`);
	}

	if (shellHtml) {
		await writeFile(path.join(outDir, "404.html"), shellHtml);
	}

	await writeFile(path.join(outDir, ".nojekyll"), "");
	console.log("Wrote 404.html and .nojekyll for GitHub Pages");
} finally {
	await preview.close();
}
