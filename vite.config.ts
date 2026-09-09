import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			'/api': {
				target: 'https://eventful-api.hostless.app',
				changeOrigin: true,
				headers: {
					Origin: 'https://eventfulapp-api.vercel.app',
				},
			},
		},
	},
});
