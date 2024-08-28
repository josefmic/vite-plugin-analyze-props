"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePropsAsArray = analyzePropsAsArray;
exports.analyzePropsAsJSON = analyzePropsAsJSON;
exports.analyzePropsAndPrint = analyzePropsAndPrint;
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const path = require('path');
/**
 * Analyzes the props used in the provided files or directories.
 * @param {...string} paths - One or more file paths or directory paths to analyze.
 * @returns {PropAnalysisResult} - An array of tuples where each tuple contains a prop name and an array of property names.
 */
function analyzePropsCore(...paths) {
    const usedProps = new Map();
    const analyzeDirectory = (directoryPath) => {
        const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(directoryPath, entry.name);
            if (entry.isDirectory()) {
                analyzeDirectory(fullPath);
            }
            else if (entry.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
                analyzeFile(fullPath);
            }
        }
    };
    const analyzeFile = (filePath) => {
        const code = fs.readFileSync(filePath, 'utf-8');
        const ast = parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
        });
        traverse(ast, {
            MemberExpression(path) {
                if (path.node.property && !path?.parentPath?.isMemberExpression()) {
                    let currentPath = path;
                    let nameParts = [];
                    while (currentPath.isMemberExpression()) {
                        if (currentPath.node.property.type === 'Identifier') {
                            nameParts.unshift(currentPath.node.property.name);
                        }
                        else if (currentPath.node.property.type === 'PrivateName') {
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
            Identifier(path) {
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
        }
        else if (stats.isFile()) {
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
function analyzePropsAsArray(...paths) {
    return analyzePropsCore(...paths);
}
/**
 * Analyzes the props and returns the result as a JSON string.
 * @param {...string} paths - One or more file paths or directory paths to analyze.
 * @returns {string} - The analyzed props as a JSON string.
 */
function analyzePropsAsJSON(...paths) {
    const result = analyzePropsCore(...paths);
    return JSON.stringify(result, null, 2);
}
/**
 * Analyzes the props and prints the result to the console.
 * @param {...string} paths - One or more file paths or directory paths to analyze.
 */
function analyzePropsAndPrint(...paths) {
    const result = analyzePropsCore(...paths);
    console.log(result);
}
