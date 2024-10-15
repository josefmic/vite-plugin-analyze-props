import fg from 'fast-glob';

/**
 * Loads files based on provided glob patterns.
 * @param {string} patterns - One or more file paths, directory paths, or glob patterns to load.
 * @returns {string[]} - An array of file paths matching the patterns.
 */
export function loadFiles(patterns: string[]): string[] {
    return fg.sync(patterns, { onlyFiles: true, absolute: true });
}
