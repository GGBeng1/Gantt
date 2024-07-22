import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineConfig({
	server: {
		open: true,
		port: 3000,
		host: '0.0.0.0',
	},
	plugins: [vue(), vueJsx()],
})
