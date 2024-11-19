import _traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { addOrUpdateComponent } from "../helpers/componentHelper";
import { parseFile } from "../helpers/fileParser";
import { ProgramOutput } from "../types/types";

const traverse = typeof _traverse === "function" ? _traverse : (_traverse as any).default;

/**
 * Analyzes the props used in the provided files or directories.
 * Supports glob patterns for file matching.
 * @param {string[]} patterns - One or more file paths, directory paths, or glob patterns to analyze.
 * @returns {ProgramOutput} - An array of tuples where each tuple contains a prop name and an array of property names.
 */
export function getUsedProps(matchedFiles: string[]): ProgramOutput {
    const output: ProgramOutput = [];

    for (const filePath of matchedFiles) {
        const ast = parseFile(filePath);

        const componentStack: string[] = [];
        let currentComponentName: string | null = null;

        traverse(ast, {
            FunctionDeclaration: {
                enter(path: NodePath<t.FunctionDeclaration>) {
                    if (path.node.id && path.node.id.name) {
                        componentStack.push(path.node.id.name);
                        currentComponentName = path.node.id.name;
                    }
                },
                exit(path: NodePath<t.FunctionDeclaration>) {
                    if (path.node.id && path.node.id.name) {
                        componentStack.pop();
                        currentComponentName = componentStack[componentStack.length - 1] || null;
                    }
                }
            },
            FunctionExpression: {
                enter(path: NodePath<t.FunctionExpression>) {
                    const parent = path.findParent((p) => p.isVariableDeclarator());
                    if (parent && t.isVariableDeclarator(parent.node) && t.isIdentifier(parent.node.id)) {
                        componentStack.push(parent.node.id.name);
                        currentComponentName = parent.node.id.name;
                    }
                },
                exit(path: NodePath<t.FunctionExpression>) {
                    const parent = path.findParent((p) => p.isVariableDeclarator());
                    if (parent && t.isVariableDeclarator(parent.node) && t.isIdentifier(parent.node.id)) {
                        componentStack.pop();
                        currentComponentName = componentStack[componentStack.length - 1] || null;
                    }
                }
            },
            ArrowFunctionExpression: {
                enter(path: NodePath<t.ArrowFunctionExpression>) {
                    const parent = path.findParent((p) => p.isVariableDeclarator());
                    if (parent && t.isVariableDeclarator(parent.node) && t.isIdentifier(parent.node.id)) {
                        componentStack.push(parent.node.id.name);
                        currentComponentName = parent.node.id.name;
                    }
                },
                exit(path: NodePath<t.ArrowFunctionExpression>) {
                    const parent = path.findParent((p) => p.isVariableDeclarator());
                    if (parent && t.isVariableDeclarator(parent.node) && t.isIdentifier(parent.node.id)) {
                        componentStack.pop();
                        currentComponentName = componentStack[componentStack.length - 1] || null;
                    }
                }
            },
            ClassDeclaration: {
                enter(path: NodePath<t.ClassDeclaration>) {
                    if (path.node.id && path.node.id.name) {
                        componentStack.push(path.node.id.name);
                        currentComponentName = path.node.id.name;
                    }
                },
                exit(path: NodePath<t.ClassDeclaration>) {
                    if (path.node.id && path.node.id.name) {
                        componentStack.pop();
                        currentComponentName = componentStack[componentStack.length - 1] || null;
                    }
                }
            },

            MemberExpression(path: NodePath<t.MemberExpression>) {
                if (path.node.property && !path.parentPath.isMemberExpression() && currentComponentName) {
                    if (!currentComponentName) return;
                
                    const isInsideJSX = path.findParent((p) => p.isJSXExpressionContainer());
                    const isPropAccess = path.findParent((p) => 
                        p.isVariableDeclarator() || 
                        p.isAssignmentExpression()
                    );

                    if (!(isInsideJSX || isPropAccess)) return;

                    if (path.parent.type === 'CallExpression' && path.node === path.parent.callee) return;
                    
                    let currentPath: NodePath = path;
                    const nameParts: string[] = [];

                    while (currentPath.isMemberExpression()) {
                        const property = currentPath.node.property;
                        if (t.isIdentifier(property)) {
                            nameParts.unshift(property.name);
                        } else if (t.isStringLiteral(property)) {
                            nameParts.unshift(property.value)
                        } else if (t.isPrivateName(property)) {
                            nameParts.unshift("PrivateName");
                        }
                        currentPath = currentPath.get("object") as NodePath;
                    }

                    if (currentPath.isIdentifier()) {
                        nameParts.unshift(currentPath.node.name);
                        addOrUpdateComponent(output, filePath, currentComponentName, [nameParts]);
                    }
                }
            },

            Identifier(path: NodePath<t.Identifier>) {
                if (path.parentPath.isJSXExpressionContainer() && currentComponentName) {
                    const propName = path.node.name;
                    addOrUpdateComponent(output, filePath, currentComponentName, [[propName]]);
                }
            },
        });
    }

    return output;
}
