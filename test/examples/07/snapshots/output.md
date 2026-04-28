Hello. I am an main markdown file with `::include-code` directive.

```json
{
     "extends": "./tsconfig.json",
     "include": [
          "./src"
     ],
     "compilerOptions": {
          "composite": true,
          "noEmit": false,
          "allowImportingTsExtensions": false,
          "outDir": "./dist",
          "rootDir": "./src"
     }
}

```
