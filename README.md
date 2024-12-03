# vite-plugin-analyze-props

Vite plugin to analyze the props of a single or multiple files.
Used to parse a file using @babel/parser followed by a traverse and analysis using @babel/traverse.

Used dependencies: @babel/parser & @babel/traverse

# Installl

```npm i vite-plugin-analyze-props```

# Config:

```
analyzeProps({
  babel?: {
    plugins: string[];
  },
  patterns: string[];
  filePath: string;
})
```

# Basic usage

***Component.tsx***
```
export const Component = ({dataUsed, dataUnused}: {
  dataUsed: number;
  dataUnused: number;
}) => {
  return (
    <div>
      <div>dataUsed: {dataUsed}</div>
      <div>dataUsed: {dataUsed.prop}</div>
    </div>
  );
};
```

***vite.config.ts***
```
import { analyzeProps } from 'vite-plugin-analyze-props';

export default defineConfig({
  plugins: [
    analyzeProps({
      patterns: ['src/**/*.tsx']
    })
  ],
})
```

***App.tsx***
```

export const App = () => {
    const usedProps =  import.meta.env.VITE_ANALYZED_PROPS;

    console.log(usedProps);
}
```

***Expected output:***
```
[
  fileName: "C:/.../src/Component.tsx,
  components: [
    name: "Component",
    used: [
      [dataUsed],
      [dataUsed, prop]
    ]
  ]
]
```