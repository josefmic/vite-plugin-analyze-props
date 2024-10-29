export type PropPath = string[]

export type AnalyzedFile = {
    fileName: string,
    components: Array<{
        name: string,
        used: PropPath[],
        unused?: PropPath[],
    }>    
}

export type ProgramOutput = AnalyzedFile[];