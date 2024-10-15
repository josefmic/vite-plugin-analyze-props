import { parse } from "@babel/parser";
import fs from 'fs';

/**
 * Parses the given file and returns the AST.
 * @param {string} filePath - The path to the file to parse.
 * @returns {import('@babel/types').File} - The parsed AST.
 */
export function parseFile(filePath: string) {
    const code = fs.readFileSync(filePath, 'utf-8');
    return parse(code, {
        sourceType: 'module',
        plugins: [
            'jsx', 
            'typescript',
        ],
    });
}
