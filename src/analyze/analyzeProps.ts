import { Plugin, PluginOption } from 'vite';
import { setBabelPlugins } from '../helpers/config';
import { getUsedProps } from './getUsedProps';

interface AnalyzePropsOptions {
    babel?: {
        plugins?: string[];
    };
    patterns: string[];
}

export function analyzeProps(options: AnalyzePropsOptions): PluginOption {
    return {
        name: 'vite-plugin-analyze-props',
        configResolved() {
            setBabelPlugins(options?.babel?.plugins || []);
            getUsedProps(options.patterns)
        }
    };
}