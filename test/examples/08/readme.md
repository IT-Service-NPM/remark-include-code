# Removing the general extra indentation for a block of code

You can remove extra indentation with `trimExtraIndent` attribute or parameter
(for example, if You insert a specified range of lines from a file
with `fromLine` and `toLine` attributes).

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

Code fragment with extra indent,
removed with `trimExtraIndent` attribute (two spaces):

::include-code{file="./included.ts" language="typescript" fromLine=9 toLine=-1 tabWidth=2 trimExtraIndent}

Code fragment without extra indent:

::include-code{file="./included.ts" language="typescript" fromLine=6 tabWidth=2 trimExtraIndent}

```

included.ts:

```typescript
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import { remarkIncludeCodePreset } from '@it-service-npm/remark-include-code/async';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()

    .use(remarkIncludeCodePreset)

    .process(await vFile.read(filePath));
};

```

Remark output:

````markdown
Hello. I am an main markdown file with `::include-code` directive.

Code fragment with extra indent,
removed with `trimExtraIndent` attribute (two spaces):

```typescript
return remark()

  .use(remarkIncludeCodePreset)

  .process(await vFile.read(filePath));
```

Code fragment without extra indent:

```typescript
export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()

    .use(remarkIncludeCodePreset)

    .process(await vFile.read(filePath));
};
```

````
