import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist");

const indexHtml = path.join(outDir, "index.html");

await copyFile(indexHtml, path.join(outDir, "404.html"));
await writeFile(path.join(outDir, ".nojekyll"), "");
console.log("Wrote 404.html and .nojekyll for GitHub Pages");
