let babelPlugins: any[] = [];

export function setBabelPlugins(plugins: string[]) {
    babelPlugins = plugins;
}

export function getBabelPlugins() {
    return babelPlugins;
}
