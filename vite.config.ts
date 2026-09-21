import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {NodeGlobalsPolyfillPlugin} from "@esbuild-plugins/node-globals-polyfill";
import { visualizer } from 'rollup-plugin-visualizer';


// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), visualizer({
            filename: './dist/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
        }),],
	build: {
		outDir: "dist",
	},
	base: "/",
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: "globalThis",
			},
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true,
				}),
			],
		},
	},
	resolve: {
		alias: {
			buffer: "buffer",
		},
	},
	server: {
		headers: {
			"Cross-Origin-Opener-Policy": "same-origin-allow-popups",
		},
	},
});
