
export async function loadUserBabelPlugins(pluginNames: string[]) {
    
    const plugins = await Promise.all(
        pluginNames.map(async (plugin) => {
            try {
                const pluginModule = await import(plugin);
                return pluginModule.default || pluginModule;
            } catch (err) {
                throw new Error(`${err}`);
            }
        })
    );

    return plugins;
}
