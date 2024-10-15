import _traverse, { NodePath } from "@babel/traverse";
import { addOrUpdateComponent } from "../helpers/componentHelper";
import { loadFiles } from "../helpers/fileLoader";
import { parseFile } from "../helpers/fileParser";
import { ProgramOutput } from "../types/types";

const traverse = typeof _traverse === "function" ? _traverse : (_traverse as any).default;

/**
 * Analyzes the props used in the provided files or directories.
 * Supports glob patterns for file matching.
 * @param {string} patterns - One or more file paths, directory paths, or glob patterns to analyze.
 * @returns {ProgramOutput} - An array of tuples where each tuple contains a prop name and an array of property names.
 */
export function getUsedProps(patterns: string[]): ProgramOutput {
    const output: ProgramOutput = [];
    const matchedFiles = loadFiles(patterns);

    for (const filePath of matchedFiles) {
        const ast = parseFile(filePath);

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
                        addOrUpdateComponent(output, filePath, currentPath.node.name, [nameParts]);
                    }
                }
            },
            Identifier(path: NodePath<any>) {
                if (path.isIdentifier() && path.parentPath.isJSXExpressionContainer()) {
                    const propName = path.node.name;
                    addOrUpdateComponent(output, filePath, propName, [[propName]]);
                }
            },
        });
    }

    console.log('analyzeProps:', JSON.stringify(output, null, 2));
    return output;
}