import { resolve } from 'path';
export default {
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'Vite Plugin Analyze Props',
            fileName: 'vite-plugin-analyze-props'
        }
    }
}