import { parse } from '@babel/parser';
import fs from 'fs';
import { getBabelPlugins } from './config';

export function transformCode(code: string): string {
    return code;
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
