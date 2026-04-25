# Inserting a specified range of lines from a file

You can insert a specified range of lines from a file
with `fromLine` and `toLine` attributes.

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

::include-code{file="./included.ts" language="typescript" fromLine=9 toLine=-1}

::include-code{file="./included.ts" language="typescript" fromLine=9 toLine=11}

_That_ should do it!

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

```typescript
  return remark()
    .use(remarkIncludeCodePreset)
    .process(await vFile.read(filePath));
```

```typescript
  return remark()
    .use(remarkIncludeCodePreset)
    .process(await vFile.read(filePath));
```

*That* should do it!

````
