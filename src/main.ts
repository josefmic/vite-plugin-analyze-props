import { ParserOptions, parse } from "@babel/parser";
import _traverse, { NodePath } from "@babel/traverse";
import fs from 'fs';
import path from 'path';

const traverse = typeof _traverse === "function" ? _traverse : (_traverse as any).default;

// Define the type for the result of the analysis
type PropAnalysisResult = [string, string[]][];

/**
 * Analyzes the props used in the provided files or directories.
 * @param {...string} paths - One or more file paths or directory paths to analyze.
 * @returns {PropAnalysisResult} - An array of tuples where each tuple contains a prop name and an array of property names.
 */
function analyzePropsCore(...paths: string[]): PropAnalysisResult {
    const usedProps = new Map<string, string[]>();

    const analyzeDirectory = (directoryPath: string) => {
        const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(directoryPath, entry.name);
            if (entry.isDirectory()) {
                analyzeDirectory(fullPath);
            } else if (entry.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
                analyzeFile(fullPath);
            }
        }
    };

    const analyzeFile = (filePath: string) => {
        const code = fs.readFileSync(filePath, 'utf-8');
        const ast = parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
        } as ParserOptions);

        traverse(ast, {
            MemberExpression(path: NodePath<any>) {
                if (path.node.property && !path?.parentPath?.isMemberExpression()) {
                    let currentPath = path;
                    let nameParts: string[] = [];

                    while (currentPath.isMemberExpression()) {
                      if (currentPath.node.property.type === 'Identifier') {
                        nameParts.unshift(currentPath.node.property.name);
                      } else if (currentPath.node.property.type === 'PrivateName') {
                          nameParts.unshift(`PrivateName`);
                      }
                      currentPath = currentPath.get('object');
                    }

                    if (currentPath.isIdentifier()) {
                        nameParts.unshift(currentPath.node.name);
                        const propName = nameParts.join('.');
                        usedProps.set(propName, [...(usedProps.get(propName) ?? []), path.node.property.name]);
                    }
                }
            },
            Identifier(path: NodePath<any>) {
                if (path.isIdentifier() && path.parentPath.isJSXExpressionContainer()) {
                    const propName = path.node.name;
                    if (!usedProps.has(propName)) {
                        usedProps.set(propName, [propName]);
                    }
                }
            },
        });
    };

    for (const path of paths) {
        const stats = fs.statSync(path);
        if (stats.isDirectory()) {
            analyzeDirectory(path);
        } else if (stats.isFile()) {
            analyzeFile(path);
        }
    }

    return Array.from(usedProps.entries());
}

/**
 * Analyzes the props and returns the result as an array.
 * @param {...string} paths - One or more file paths or directory paths to analyze.
 * @returns {PropAnalysisResult} - The analyzed props as an array.
 */
export function analyzePropsAsArray(...paths: string[]): PropAnalysisResult {
    return analyzePropsCore(...paths);
}

/**
 * Analyzes the props and returns the result as a JSON string.
 * @param {...string} paths - One or more file paths or directory paths to analyze.
 * @returns {string} - The analyzed props as a JSON string.
 */
export function analyzePropsAsJSON(...paths: string[]): string {
    const result = analyzePropsCore(...paths);
    return JSON.stringify(result, null, 2);
}