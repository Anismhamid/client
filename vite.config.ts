import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {NodeGlobalsPolyfillPlugin} from "@esbuild-plugins/node-globals-polyfill";


// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
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
});
