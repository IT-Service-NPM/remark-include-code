# Including the content of code files

The `@it-service-npm/remark-include-code` package allows you
to embed code files within your Markdown documents.

Async plugin using example:

```
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

Source files:

main.md:

```
Hello. I am an main markdown file with `::include-code` directives.

::include-code{file=./included1.ts}

After first file.

::include-code{file="./included 2.ts"}

After second file.

_That_ should do it!

```

included1.ts:

```
export function functionInIncluded1File(): void {
  console.info('file #1');
};

```

included 2.ts:

```
export function functionInIncluded2File(): void {
  console.info('file #2');
};

```

Remark output:

````
Hello. I am an main markdown file with `::include-code` directives.

```
export function functionInIncluded1File(): void {
  console.info('file #1');
};

```

After first file.

```
export function functionInIncluded2File(): void {
  console.info('file #2');
};

```

After second file.

*That* should do it!

````
