# Tabs replacing with spaces

`::include-code` replace tabs in code with spaces if `tabWidth` attribute specified.

> [!IMPORTANT]
> With `useEditorConfig` attribute or plugin parameter
> `tab_width` property value from `.editorconfig`
> used for `tabWidth`.

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

::include-code{file="./example.json" language="json" tabWidth=4}
```

example.json:

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

Remark output:

````markdown
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
````

Or You can use `tab_width` property value from `.editorconfig` file with
`useEditorConfig` attribute or parameter.

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

::include-code{file="./example.json" language="json"}
```

example.ts:

```typescript
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkIncludeCode } from '@it-service-npm/remark-include-code/async';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()
    .use(remarkDirective)
    .use(remarkIncludeCode, { useEditorConfig: true })
    .process(await vFile.read(filePath));
};
```
