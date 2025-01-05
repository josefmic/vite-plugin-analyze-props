# vite-plugin-analyze-props

Vite plugin to analyze the props of a single or multiple files.
Used to parse a file using @babel/parser followed by a traverse and analysis using @babel/traverse.

Used dependencies: @babel/parser & @babel/traverse

## Install

`npm i vite-plugin-analyze-props`

## Basic usage

### vite.config.ts

```tsx
import { analyzeProps } from "vite-plugin-analyze-props";

export default defineConfig({
  plugins: [
    analyzeProps({
      patterns: ["src/**/*.tsx"],
      fileOutput: "src/output.json"
    }),
  ],
});
```

### Get the analysis output

```tsx
import * as fs from "node:fs"

// Get the output from env variable
const usedProps = import.meta.env.VITE_ANALYZED_PROPS;

// Get the output from file (when `fileOutput` option is specified)
const usedPropsFromFile = JSON.parse(fs.readFileSync("./src/output.json"));
```

### Example input/output

**Input:**

```tsx
export const Component = ({
  data,
}: {
  data: {
    used1: number;
    used2: number;
    unused: number; 
  }
}) => {
  return (
    <div>
      <div>used1: {data.used1}</div>
      <div>used2: {data.used2}</div>
    </div>
  );
};
```

**Expected output:**

```ts
[
  {
    fileName: "C:/.../src/Component.tsx",
    components: [
      {
        name: "Component",
        used: [
          ["data", "used1"],
          ["data", "used2"]
        ]
      }
    ]
  }
]
```

## `analyzeProps` config

```ts
interface AnalyzePropsOptions {
  /**
   * Glob pattern of files to analyze
   * @example ["./src/pages/*.tsx", "./src/components/**/*.tsx"]
   */
  patterns: string[];

  /**
   * Where to output the analysis result
   * @example "./output.json"
   */
  filePath?: string;

  babel?: {
    /**
     * Optional list of babel plugins to be run before running the analysis
     */
    plugins?: string[];
  };
}
```
