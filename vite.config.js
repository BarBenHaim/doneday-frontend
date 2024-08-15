import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
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
