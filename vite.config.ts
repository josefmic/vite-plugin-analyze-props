import { builtinModules } from 'module';

export default {
    build: {
      minify: false,
      emptyOutDir: false,
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
  }
}; '! '