import { transformAsync } from "@babel/core";
import { parse } from '@babel/parser';
import fs from 'fs/promises';
import { loadUserBabelPlugins } from './userBabelPluginLoader';
import { getBabelPlugins } from "./config";

/**
 * Transforms the given code using Babel and user-defined plugins.
 * @param {string} code - The code to transform.
 * @param {string} fileName - The file name associated with the code.
 * @returns {Promise<string>} - The transformed code.
 */
export async function transformCode(code: string, fileName: string): Promise<string> {
    
    const pluginNames = getBabelPlugins();
    const plugins = await loadUserBabelPlugins(pluginNames);

    const presets = await loadUserBabelPlugins([
        '@babel/preset-react',
        '@babel/preset-typescript'
    ]);

    if (plugins.length === 0) {
        return code;
    }

    const result = await transformAsync(code, {
        plugins,
        filename: fileName,
        presets,
    });

    if (!result || !result.code) {
        throw new Error('Babel transformation failed.');
    }

    return result.code;
}

/**
 * Parses the given file, applies transformations, and returns the AST.
 * @param {string} filePath - The path to the file to parse.
 * @returns {Promise<import('@babel/types').File>} - The transformed and parsed AST.
 */
export async function parseFile(filePath: string) {
    let code = await fs.readFile(filePath, 'utf-8');
    const plugins = getBabelPlugins();

    if (plugins?.length > 0) {
        code = await transformCode(code, filePath); // Pass the filePath as fileName
    }

    return parse(code ?? "", {
        sourceType: 'module',
        plugins: [
            'jsx', 
            'typescript'
        ],
    });
}
