import react from '@vitejs/plugin-react';
import { builtinModules } from 'module';
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      minify: true,
      emptyOutDir: true,
      lib: {
        entry: './src/main',
        name: 'VitePluginAnalyzeProps',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: [
          ...builtinModules,
          'fs', 
          'path',
          '@babel/parser',
          '@babel/traverse'
        ],
        output: {
          exports: 'named',
        },
      },
    },
    define: {
      'process.env': env,
    },
    plugins: [
      dts({
        copyDtsFiles: true,
        rollupTypes: true,
      })
    ]
  }

})