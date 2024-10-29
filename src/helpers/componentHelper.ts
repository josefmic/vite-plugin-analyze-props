import { ProgramOutput } from "../types/types";

/**
 * Helper function to update or add a component in the output.
 * @param {ProgramOutput} output - The current output array.
 * @param {string} filePath - The current file being analyzed.
 * @param {string} componentName - The name of the component or prop to add.
 * @param {string[][]} nameParts - The parts of the name to add to `used`.
 */
export function addOrUpdateComponent(output: ProgramOutput, filePath: string, componentName: string, nameParts: string[][]) {
    const existingFile = output.find(x => x.fileName === filePath);

    if (existingFile) {
        const existingComponent = existingFile.components.find(x => x.name === componentName);
                
        if (existingComponent) {
            if (!existingComponent.used.some(x => x.join('.') === nameParts[0].join('.'))) {
                existingComponent.used.push(...nameParts);
            }
        } else {
            existingFile.components.push({
                name: componentName,
                used: nameParts,
            });
        }
    } else {
        output.push({
            fileName: filePath,
            components: [{
                name: componentName,
                used: nameParts,
            }]
        });
    }
}
