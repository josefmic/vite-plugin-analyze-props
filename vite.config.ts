import { builtinModules } from 'module';
import dts from 'vite-plugin-dts';

export default {
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
    plugins: [
      dts({
        copyDtsFiles: true,
        rollupTypes: true,
      })
    ]
};