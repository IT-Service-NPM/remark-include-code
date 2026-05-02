Hello. I am an main markdown file with `::include-code` directive.

Code fragment with extra indent,
removed with `trimExtraIndent` attribute (two spaces):

::include-code{file="./included.ts" language="typescript" fromLine=9 toLine=-1 tabWidth=2 trimExtraIndent}

Code fragment without extra indent:

::include-code{file="./included.ts" language="typescript" fromLine=6 tabWidth=2 trimExtraIndent}
