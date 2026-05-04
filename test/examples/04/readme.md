# Defining the code file encoding

You can define the code file encoding with `encoding` attribute.
Default — `'utf8'`.

> [!IMPORTANT]
> With `useEditorConfig` attribute or plugin parameter
> `charset` property value from `.editorconfig` file used for `encoding`

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

::include-code{file="./included1.bat" language="batchfile" encoding="CP866"}

```

included1.bat:

```batchfile
echo "Кириллический текст"

```

Remark output:

````markdown
Hello. I am an main markdown file with `::include-code` directive.

```batchfile
echo "Кириллический текст"

```

````

Or You can use `charset` property value for encoding from `.editorconfig` file with
`useEditorConfig` attribute or parameter.

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

::include-code{file="./included1.bat" language="batchfile"}

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
