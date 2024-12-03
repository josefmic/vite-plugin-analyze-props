import fg from 'fast-glob';

/**
 * Loads files based on provided glob patterns.
 * @param {string} patterns - One or more file paths, directory paths, or glob patterns to load.
 * @returns {string[]} - An array of file paths matching the patterns.
 */
export async function loadFiles(patterns: string[]): Promise<string[]> {
    return fg.async(patterns, { onlyFiles: true, absolute: true });
}
