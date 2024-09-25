# vite-plugin-analyze-props

Vite plugin to analyze the props of a single or multiple files.
Used to parse a file using @babel/parser followed by a traverse and analysis using @babel/traverse.

Used dependencies: @babel/parser & @babel/traverse

# Installl

```npm i vite-plugin-analyze-props```

# Available methods:

* analyzePropsAsArray()
    * Analyzes the props and returns the result as an array.

* analyzePropsAsJSON()
    * Analyzes the props and returns the result as a JSON string.

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
    </div>
  );
};
```

***App.tsx***
```
import { analyzePropsAsArray } from 'vite-plugin-analyze-props';

export const App = () => {
    const usedProps = 
        analyzePropsAsArray('./src/components/Component.tsx');

    console.log(userProps);
}
```

***Expected output:***
```
[
    ['dataUsed', ['dataUsed']],
]
```