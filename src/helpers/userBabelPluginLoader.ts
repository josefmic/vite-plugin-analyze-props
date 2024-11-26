import { getBabelPlugins } from "./config";

export function loadUserBabelPlugins() {
    const plugins = getBabelPlugins();
    
    return plugins.map((plugin) => {
        try {
            const packagePath = require.resolve(plugin);
            return require(packagePath);
        } catch (err) {
            throw new Error(`Failed to load Babel plugin "${plugin}". Make sure it is installed.`);
        }
    });
}