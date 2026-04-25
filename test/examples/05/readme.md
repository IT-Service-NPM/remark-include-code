# Trim final newline

You can trim final newline with `trim-final-newline` attribute.

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

::include-code{file="./included1.ts" language="typescript" trim-final-newline}

_That_ should do it!

```

included1.ts:

```typescript
export function inFileWithFinalNewline(): void {
  console.info('file #1');
};

```

Remark output:

````markdown
Hello. I am an main markdown file with `::include-code` directive.

```typescript
export function inFileWithFinalNewline(): void {
  console.info('file #1');
};
```

*That* should do it!

````

And You can trim final newline for all `::include-code` directives with
remark settings without `trim-final-newline` attribute.

Remark settings (.remarkrc.mjs):

```javascript
import remarkDirective from 'remark-directive';
import { remarkIncludeCode } from '@it-service-npm/remark-include-code/async';

export default {
  plugins: [
    remarkDirective,
    remarkIncludeCode,
  ],
  settings: {
    bullet: '-',
    includeCodeSettings: {
      'trim-final-newline': true
    }
  }
}
```

or without config file:

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
    .use(remarkIncludeCode)
    .use({
      settings: {
        includeCodeSettings: {
          'trim-final-newline': true
        }
      }
    })
    .process(await vFile.read(filePath));
};
```

> \[!IMPORTANT]
>
> Package presets `remarkIncludeCodePreset` and `remarkIncludePresetSync`
> enables `trim-final-newline` setting by default.
