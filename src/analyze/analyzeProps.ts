import { PluginOption, ViteDevServer } from 'vite';
import { setBabelPlugins } from '../helpers/config';
import { loadFiles } from '../helpers/fileLoader';
import { getUsedProps } from './getUsedProps';

interface AnalyzePropsOptions {
    babel?: {
        plugins?: string[];
    };
    patterns: string[];
}

export function analyzeProps(options: AnalyzePropsOptions): PluginOption {
    const matchedFiles = loadFiles(options.patterns);
    setBabelPlugins(options?.babel?.plugins || []);
    let output = getUsedProps(matchedFiles);

    return {
        name: 'vite-plugin-analyze-props',

        handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
            if (matchedFiles.includes(file)) {
                output = getUsedProps(matchedFiles);
                server.ws.send({ type: 'full-reload' });
            }
        },

        config() {
            return {
                define: {
                    'ANALYZED_PROPS': JSON.stringify(output),
                },
            };
        },
    };
}
