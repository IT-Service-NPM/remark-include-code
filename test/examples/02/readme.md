# Defining the code language

You can define the code language with `language` attribute.

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

::include-code{file="./included1.ts" language="typescript"}

_That_ should do it!

```

included1.ts:

```typescript
export function functionInIncluded1File(): void {
  console.info('file #1');
};

```

Remark output:

````markdown
Hello. I am an main markdown file with `::include-code` directive.

```typescript
export function functionInIncluded1File(): void {
  console.info('file #1');
};

```

*That* should do it!

````
