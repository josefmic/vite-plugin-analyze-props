type PropAnalysisResult = [string, string[]][];
/**
 * Analyzes the props and returns the result as an array.
 * @param {...string} paths - One or more file paths or directory paths to analyze.
 * @returns {PropAnalysisResult} - The analyzed props as an array.
 */
export declare function analyzePropsAsArray(...paths: string[]): PropAnalysisResult;
/**
 * Analyzes the props and returns the result as a JSON string.
 * @param {...string} paths - One or more file paths or directory paths to analyze.
 * @returns {string} - The analyzed props as a JSON string.
 */
export declare function analyzePropsAsJSON(...paths: string[]): string;
/**
 * Analyzes the props and prints the result to the console.
 * @param {...string} paths - One or more file paths or directory paths to analyze.
 */
export declare function analyzePropsAndPrint(...paths: string[]): void;
export {};
