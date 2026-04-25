# Trim final newline

You can trim final newline with `trimFinalNewline` attribute.

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

::include-code{file="./included1.ts" language="typescript" trimFinalNewline}

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
remark settings without `trimFinalNewline` attribute.

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
      trimFinalNewline: true
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
          trimFinalNewline: true
        }
      }
    })
    .process(await vFile.read(filePath));
};
```

> \[!IMPORTANT]
>
> Package presets `remarkIncludeCodePreset` and `remarkIncludePresetSync`
> enables `trimFinalNewline` setting by default.
