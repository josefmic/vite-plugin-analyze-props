/// <reference types="vite/client" />

import { ProgramOutput } from "./types/types";

interface ImportMetaEnv {
    readonly ANALYZED_PROPS: ProgramOutput;
}