import { PluginOption, ViteDevServer } from 'vite';
import { setBabelPlugins } from '../helpers/config';
import { loadFiles } from '../helpers/fileLoader';
import { getUsedProps } from './getUsedProps';
import path from 'path';
import fs from 'fs/promises';
import { AnalyzedFile, ProgramOutput } from '../types/types';

interface AnalyzePropsOptions {
    babel?: {
        plugins?: string[];
    };
    patterns: string[];
    filePath?: string;
}

let analyzedProps: ProgramOutput = [];

export function analyzeProps(options: AnalyzePropsOptions): PluginOption {

    return {
        name: 'vite-plugin-analyze-props',

        async configResolved() {
            await setBabelPlugins(options?.babel?.plugins || []);

            const matchedFiles = await loadFiles(options.patterns);
            analyzedProps = await getUsedProps(matchedFiles);

            if (options.filePath) {
                const resolvedPath = path.resolve(options.filePath);
                const dirPath = path.dirname(resolvedPath);

                await fs.mkdir(dirPath, { recursive: true });
                await fs.writeFile(resolvedPath, JSON.stringify(analyzedProps, null, 2), 'utf-8');
            }
        },

        handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
            const files = analyzedProps.map((o: AnalyzedFile) => o.fileName);
            if (files.includes(file)) {
                console.log("\x1b[36m[vite-plugin-analyze-props]\x1b[0m \x1b[32mFile changed, analyzing props\x1b[0m");
                server.restart();
            }
        },
    };
}