import { cp, mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);

await copyFile(new URL("vite.index.html", dist), new URL("index.html", dist));
await rm(new URL("vite.index.html", dist), { force: true });
await writeFile(new URL(".nojekyll", dist), "");

const rootAssets = new URL("assets/", root);
if (existsSync(rootAssets)) {
  await rm(rootAssets, { recursive: true, force: true });
}

await cp(new URL("assets/", dist), rootAssets, { recursive: true });

const publicFiles = [
  "apple-touch-icon.png",
  "favicon.png",
  "icon-512.png",
  "logo.png",
  "manifest.webmanifest",
  "sw.js",
];

await Promise.all(publicFiles.map((file) => copyFile(new URL(file, dist), new URL(file, root))));
await mkdir(root, { recursive: true });
await writeFile(new URL(".nojekyll", root), "");
