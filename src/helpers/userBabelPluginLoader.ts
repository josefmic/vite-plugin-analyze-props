import { getBabelPlugins } from "./config";

export function loadUserBabelPlugins() {
    const plugins = getBabelPlugins();
    
    return plugins.map((plugin) => {
        try {
            const packagePath = require.resolve("C:/Users/micha/AppData/Roaming/npm/node_modules/babel-plugin-transform-react-pug");
            return require(packagePath);
        } catch (err) {
            throw new Error(`Failed to load Babel plugin "${plugin}". Make sure it is installed.`);
        }
    });
}
  