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
