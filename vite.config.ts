import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        visualizer({
            filename: './stats/stats.html',
            gzipSize: true,
            brotliSize: true,
        }),
        visualizer({
            filename: './stats/stats.json',
            template: 'raw-data',
            gzipSize: true,
        }),
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return;

                    if (
                        /node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(
                            id,
                        )
                    ) {
                        return 'react-vendor';
                    }

                    if (
                        /node_modules\/(@mui\/(material|system|utils|styled-engine|private-theming)|@emotion|@popperjs|stylis|react-transition-group)\//.test(
                            id,
                        )
                    ) {
                        return 'mui-vendor';
                    }
                },
            },
        },
    },
    base: '/',
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
        },
    },
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        },
    },
});
