import { transform } from "@babel/core";
import { parse } from '@babel/parser';
import fs from 'fs';
import { loadUserBabelPlugins } from './userBabelPluginLoader';
import { getBabelPlugins } from "./config";

/**
 * Transforms the given code using Babel and user-defined plugins.
 * @param {string} code - The code to transform.
 * @returns {string} - The transformed code.
 */
export function transformCode(code: string): string {
    const plugins = loadUserBabelPlugins();

    if (plugins.length === 0) {
        return code;
    }

    const result = transform(code, {
        plugins
    })

    if (!result || !result.code) {
        throw new Error('Babel transformation failed.');
    }

    return result.code;
}

/**
 * Parses the given file, applies transformations, and returns the AST.
 * @param {string} filePath - The path to the file to parse.
 * @returns {import('@babel/types').File} - The transformed and parsed AST.
 */
export function parseFile(filePath: string) {
    let code = fs.readFileSync(filePath, 'utf-8');
    const plugins = getBabelPlugins();

    if (plugins?.length > 0) {
        code = transformCode(code);
    }

    return parse(code ?? "", {
        sourceType: 'module',
        plugins: [
            'jsx', 
            'typescript',
        ],
    });
}
