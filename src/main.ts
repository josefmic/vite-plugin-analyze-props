import { ParserOptions, parse } from "@babel/parser";
import _traverse, { NodePath } from "@babel/traverse";
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

const traverse = typeof _traverse === "function" ? _traverse : (_traverse as any).default;

// Define the type for the result of the analysis
type PropAnalysisResult = [string, string[]][];

/**
 * Analyzes the props used in the provided files or directories.
 * Supports glob patterns for file matching.
 * @param {...string} patterns - One or more file paths, directory paths, or glob patterns to analyze.
 * @returns {PropAnalysisResult} - An array of tuples where each tuple contains a prop name and an array of property names.
 */
function analyzePropsCore(...patterns: string[]): PropAnalysisResult {
    const usedProps = new Map<string, string[]>();

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

    // Use fast-glob to find all matching files based on the provided patterns
    const matchedFiles = fg.sync(patterns, { onlyFiles: true, absolute: true });

    // Analyze each matched file
    for (const filePath of matchedFiles) {
        analyzeFile(filePath);
    }

    return Array.from(usedProps.entries());
}

/**
 * Analyzes the props and returns the result as an array.
 * @param {...string} patterns - One or more file paths, directory paths, or glob patterns to analyze.
 * @returns {PropAnalysisResult} - The analyzed props as an array.
 */
export function analyzePropsAsArray(...patterns: string[]): PropAnalysisResult {
    return analyzePropsCore(...patterns);
}

/**
 * Analyzes the props and returns the result as a JSON string.
 * @param {...string} patterns - One or more file paths, directory paths, or glob patterns to analyze.
 * @returns {string} - The analyzed props as a JSON string.
 */
export function analyzePropsAsJSON(...patterns: string[]): string {
    const result = analyzePropsCore(...patterns);
    return JSON.stringify(result, null, 2);
}
