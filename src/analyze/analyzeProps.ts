import { PluginOption, ViteDevServer } from 'vite';
import { setBabelPlugins } from '../helpers/config';
import { loadFiles } from '../helpers/fileLoader';
import { getUsedProps } from './getUsedProps';
import path from 'path';
import fs from 'fs';

interface AnalyzePropsOptions {
    babel?: {
        plugins?: string[];
    };
    patterns: string[];
    filePath?: string;
}

export function analyzeProps(options: AnalyzePropsOptions): PluginOption {
    const matchedFiles = loadFiles(options.patterns);
    setBabelPlugins(options?.babel?.plugins || []);
    let output = getUsedProps(matchedFiles);

    if (options.filePath) {
        const resolvedPath = path.resolve(options.filePath);
        const dirPath = path.dirname(resolvedPath);
        
        fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(resolvedPath, JSON.stringify(output, null, 2), 'utf-8');
    }

    return {
        name: 'vite-plugin-analyze-props',

        handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
            if (matchedFiles.includes(file)) {
                console.log("\x1b[36m[vite-plugin-analyze-props]\x1b[0m \x1b[32mFile changed, analyzing props\x1b[0m");
                server.restart();
            }
        },

        config() {
            return {
                define: {
                    'import.meta.env.ANALYZED_PROPS': output,
                },
            };
        },
    };
}
