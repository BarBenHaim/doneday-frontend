import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../doneday-backend/public',
        emptyOutDir: true,
    },
    define: {
        global: 'window',
    },
    global: {},
})
